#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

// ── Configuration ──────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.BRAINSTORM_PORT, 10) || (49152 + Math.floor(Math.random() * 16383));
const HOST = process.env.BRAINSTORM_HOST || '127.0.0.1';
const URL_HOST = process.env.BRAINSTORM_URL_HOST || (HOST === '127.0.0.1' ? 'localhost' : HOST);
const SCREEN_DIR = process.env.BRAINSTORM_DIR || '/tmp/brainstorm';

if (!fs.existsSync(SCREEN_DIR)) {
  fs.mkdirSync(SCREEN_DIR, { recursive: true });
}

// ── Load client helper and frame template from files ────────────────────────────

const HELPER_SCRIPT = '<script>\n' + fs.readFileSync(path.join(__dirname, 'helper.js'), 'utf-8') + '\n</script>';

const FRAME_TEMPLATE = fs.readFileSync(path.join(__dirname, 'frame-template.html'), 'utf-8');

const WAITING_PAGE = `<!DOCTYPE html>
<html>
<head>
  <title>Brainstorm Companion</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; } p { color: #666; }
  </style>
</head>
<body>
  <h1>Brainstorm Companion</h1>
  <p>Waiting for content to be pushed...</p>
</body>
</html>`;

// ── Screen cache ───────────────────────────────────────────────────────────────

const knownFiles = new Set();
let cachedNewest = null;

function scanScreenDir() {
  try {
    const files = fs.readdirSync(SCREEN_DIR)
      .filter(f => f.endsWith('.html'))
      .map(f => {
        const full = path.join(SCREEN_DIR, f);
        return { name: f, path: full, mtime: fs.statSync(full).mtime.getTime() };
      })
      .sort((a, b) => b.mtime - a.mtime);

    knownFiles.clear();
    for (const f of files) knownFiles.add(f.name);
    cachedNewest = files.length > 0 ? files[0].path : null;
  } catch {
    cachedNewest = null;
  }
}

scanScreenDir();

// ── HTML rendering ─────────────────────────────────────────────────────────────

function isFullDocument(html) {
  const trimmed = html.trimStart().toLowerCase();
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html');
}

function renderPage() {
  let html;
  if (!cachedNewest) {
    html = WAITING_PAGE;
  } else {
    const raw = fs.readFileSync(cachedNewest, 'utf-8');
    html = isFullDocument(raw) ? raw : FRAME_TEMPLATE.replace('<!-- CONTENT -->', raw);
  }

  if (html.includes('</body>')) {
    html = html.replace('</body>', HELPER_SCRIPT + '\n</body>');
  } else {
    html += HELPER_SCRIPT;
  }
  return html;
}

// ── SSE ────────────────────────────────────────────────────────────────────────

const sseClients = new Set();
const SSE_KEEPALIVE_MS = 30000;

function broadcastReload() {
  for (const res of sseClients) {
    res.write('data: {"type":"reload"}\n\n');
  }
}

const keepaliveInterval = setInterval(() => {
  for (const res of sseClients) {
    res.write(':keepalive\n\n');
  }
}, SSE_KEEPALIVE_MS);

// ── HTTP server ────────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderPage());
    return;
  }

  if (req.method === 'GET' && req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write(':ok\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  if (req.method === 'POST' && req.url === '/events') {
    const body = await readBody(req);
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error(JSON.stringify({ source: 'parse-error', error: err.message }));
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('{"error":"invalid JSON"}');
      return;
    }
    console.log(JSON.stringify({ source: 'user-event', ...event }));
    if (event.choice) {
      const eventsFile = path.join(SCREEN_DIR, '.events');
      fs.appendFileSync(eventsFile, JSON.stringify(event) + '\n');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

// ── File watcher ───────────────────────────────────────────────────────────────

let debounceTimer = null;

fs.watch(SCREEN_DIR, (eventType, filename) => {
  if (!filename || !filename.endsWith('.html')) return;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const filePath = path.join(SCREEN_DIR, filename);
    if (!fs.existsSync(filePath)) return;

    const isNew = !knownFiles.has(filename);
    knownFiles.add(filename);

    // Re-scan to update cached newest (handles new files and edits)
    scanScreenDir();

    // Only clear events when a new screen is pushed, not on edits
    if (isNew) {
      const eventsFile = path.join(SCREEN_DIR, '.events');
      if (fs.existsSync(eventsFile)) {
        try { fs.unlinkSync(eventsFile); } catch {}
      }
    }

    console.log(JSON.stringify({ type: isNew ? 'screen-added' : 'screen-updated', file: filePath }));
    broadcastReload();
  }, 100);
});

// ── Graceful shutdown ──────────────────────────────────────────────────────────

function shutdown() {
  clearInterval(keepaliveInterval);
  clearTimeout(debounceTimer);

  // Clean up PID file
  const pidFile = path.join(SCREEN_DIR, '.server.pid');
  try { fs.unlinkSync(pidFile); } catch {}

  // Close SSE connections
  for (const res of sseClients) {
    try { res.end(); } catch {}
  }
  sseClients.clear();

  server.close(() => process.exit(0));

  // Force exit if close hangs
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// ── Start ──────────────────────────────────────────────────────────────────────

server.on('error', (err) => {
  console.error(JSON.stringify({ type: 'server-error', error: err.message }));
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const info = JSON.stringify({
    type: 'server-started',
    port: PORT,
    host: HOST,
    url_host: URL_HOST,
    url: `http://${URL_HOST}:${PORT}`,
    screen_dir: SCREEN_DIR
  });
  console.log(info);
  fs.writeFileSync(path.join(SCREEN_DIR, '.server-info'), info + '\n');
});
