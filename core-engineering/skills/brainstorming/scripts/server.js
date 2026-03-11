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

// ── Embedded client helper (injected into every page) ──────────────────────────

const HELPER_SCRIPT = `<script>
(function() {
  var evtSource = null;

  function connectSSE() {
    evtSource = new EventSource('/events');
    evtSource.onmessage = function(msg) {
      var data = JSON.parse(msg.data);
      if (data.type === 'reload') window.location.reload();
    };
    evtSource.onerror = function() {
      evtSource.close();
      setTimeout(connectSSE, 1000);
    };
  }

  function sendEvent(event) {
    event.timestamp = Date.now();
    fetch('/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(function() {});
  }

  document.addEventListener('click', function(e) {
    var target = e.target.closest('[data-choice]');
    if (!target) return;

    sendEvent({
      type: 'click',
      text: target.textContent.trim(),
      choice: target.dataset.choice,
      id: target.id || null
    });

    setTimeout(function() {
      var indicator = document.getElementById('indicator-text');
      if (!indicator) return;
      var container = target.closest('.options') || target.closest('.cards');
      var selected = container ? container.querySelectorAll('.selected') : [];
      if (selected.length === 0) {
        indicator.textContent = 'Click an option above, then return to the terminal';
      } else if (selected.length === 1) {
        var label = (selected[0].querySelector('h3, .content h3, .card-body h3') || {}).textContent || selected[0].dataset.choice;
        indicator.innerHTML = '<span class="selected-text">' + label.trim() + ' selected</span> \\u2014 return to terminal to continue';
      } else {
        indicator.innerHTML = '<span class="selected-text">' + selected.length + ' selected</span> \\u2014 return to terminal to continue';
      }
    }, 0);
  });

  window.selectedChoice = null;

  window.toggleSelect = function(el) {
    var container = el.closest('.options') || el.closest('.cards');
    var multi = container && container.dataset.multiselect !== undefined;
    if (container && !multi) {
      container.querySelectorAll('.option, .card').forEach(function(o) { o.classList.remove('selected'); });
    }
    if (multi) {
      el.classList.toggle('selected');
    } else {
      el.classList.add('selected');
    }
    window.selectedChoice = el.dataset.choice;
  };

  window.brainstorm = {
    send: sendEvent,
    choice: function(value, metadata) { sendEvent(Object.assign({ type: 'choice', value: value }, metadata || {})); }
  };

  connectSSE();
})();
</script>`;

// ── Embedded frame template ────────────────────────────────────────────────────

const FRAME_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <title>Visual Brainstorming</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }

    :root {
      --bg-primary: #f5f5f7; --bg-secondary: #ffffff; --bg-tertiary: #e5e5e7;
      --border: #d1d1d6; --text-primary: #1d1d1f; --text-secondary: #86868b;
      --text-tertiary: #aeaeb2; --accent: #0071e3; --accent-hover: #0077ed;
      --success: #34c759; --warning: #ff9f0a; --error: #ff3b30;
      --selected-bg: #e8f4fd; --selected-border: #0071e3;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #1d1d1f; --bg-secondary: #2d2d2f; --bg-tertiary: #3d3d3f;
        --border: #424245; --text-primary: #f5f5f7; --text-secondary: #86868b;
        --text-tertiary: #636366; --accent: #0a84ff; --accent-hover: #409cff;
        --selected-bg: rgba(10, 132, 255, 0.15); --selected-border: #0a84ff;
      }
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary); color: var(--text-primary);
      display: flex; flex-direction: column; line-height: 1.5;
    }

    .header {
      background: var(--bg-secondary); padding: 0.5rem 1.5rem;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--border); flex-shrink: 0;
    }
    .header h1 { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }
    .header .status { font-size: 0.7rem; color: var(--success); display: flex; align-items: center; gap: 0.4rem; }
    .header .status::before { content: ''; width: 6px; height: 6px; background: var(--success); border-radius: 50%; }

    .main { flex: 1; overflow-y: auto; }
    #claude-content { padding: 2rem; min-height: 100%; }

    .indicator-bar {
      background: var(--bg-secondary); border-top: 1px solid var(--border);
      padding: 0.5rem 1.5rem; flex-shrink: 0; text-align: center;
    }
    .indicator-bar span { font-size: 0.75rem; color: var(--text-secondary); }
    .indicator-bar .selected-text { color: var(--accent); font-weight: 500; }

    h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
    h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem; }
    .subtitle { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .section { margin-bottom: 2rem; }
    .label { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }

    .options { display: flex; flex-direction: column; gap: 0.75rem; }
    .option {
      background: var(--bg-secondary); border: 2px solid var(--border);
      border-radius: 12px; padding: 1rem 1.25rem; cursor: pointer;
      transition: all 0.15s ease; display: flex; align-items: flex-start; gap: 1rem;
    }
    .option:hover { border-color: var(--accent); }
    .option.selected { background: var(--selected-bg); border-color: var(--selected-border); }
    .option .letter {
      background: var(--bg-tertiary); color: var(--text-secondary);
      width: 1.75rem; height: 1.75rem; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 0.85rem; flex-shrink: 0;
    }
    .option.selected .letter { background: var(--accent); color: white; }
    .option .content { flex: 1; }
    .option .content h3 { font-size: 0.95rem; margin-bottom: 0.15rem; }
    .option .content p { color: var(--text-secondary); font-size: 0.85rem; margin: 0; }

    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .card {
      background: var(--bg-secondary); border: 1px solid var(--border);
      border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.15s ease;
    }
    .card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .card.selected { border-color: var(--selected-border); border-width: 2px; }
    .card-image { background: var(--bg-tertiary); aspect-ratio: 16/10; display: flex; align-items: center; justify-content: center; }
    .card-body { padding: 1rem; }
    .card-body h3 { margin-bottom: 0.25rem; }
    .card-body p { color: var(--text-secondary); font-size: 0.85rem; }

    .mockup {
      background: var(--bg-secondary); border: 1px solid var(--border);
      border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem;
    }
    .mockup-header {
      background: var(--bg-tertiary); padding: 0.5rem 1rem;
      font-size: 0.75rem; color: var(--text-secondary); border-bottom: 1px solid var(--border);
    }
    .mockup-body { padding: 1.5rem; }

    .split { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 700px) { .split { grid-template-columns: 1fr; } }

    .pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }
    .pros, .cons { background: var(--bg-secondary); border-radius: 8px; padding: 1rem; }
    .pros h4 { color: var(--success); font-size: 0.85rem; margin-bottom: 0.5rem; }
    .cons h4 { color: var(--error); font-size: 0.85rem; margin-bottom: 0.5rem; }
    .pros ul, .cons ul { margin-left: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); }
    .pros li, .cons li { margin-bottom: 0.25rem; }

    .placeholder {
      background: var(--bg-tertiary); border: 2px dashed var(--border);
      border-radius: 8px; padding: 2rem; text-align: center; color: var(--text-tertiary);
    }

    .mock-nav { background: var(--accent); color: white; padding: 0.75rem 1rem; display: flex; gap: 1.5rem; font-size: 0.9rem; }
    .mock-sidebar { background: var(--bg-tertiary); padding: 1rem; min-width: 180px; }
    .mock-content { padding: 1.5rem; flex: 1; }
    .mock-button { background: var(--accent); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem; }
    .mock-input { background: var(--bg-primary); border: 1px solid var(--border); border-radius: 6px; padding: 0.5rem; width: 100%; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Visual Brainstorming</h1>
    <div class="status">Connected</div>
  </div>
  <div class="main">
    <div id="claude-content">
      <!-- CONTENT -->
    </div>
  </div>
  <div class="indicator-bar">
    <span id="indicator-text">Click an option above, then return to the terminal</span>
  </div>
</body>
</html>`;

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
