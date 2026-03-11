#!/usr/bin/env node

const http = require('http');
const crypto = require('crypto');
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

// ── Load client helper and frame template once at startup ────────────────────

const FRAME_TEMPLATE = fs.readFileSync(path.join(__dirname, 'frame-template.html'), 'utf-8');
const HELPER_SCRIPT = '<script>\n' + fs.readFileSync(path.join(__dirname, 'helper.js'), 'utf-8') + '\n</script>';

const WAITING_PAGE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
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

// ── HTML rendering ─────────────────────────────────────────────────────────────

function isFullDocument(html) {
  const trimmed = html.trimStart().toLowerCase();
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html');
}

function getNewestScreen() {
  try {
    const files = fs.readdirSync(SCREEN_DIR)
      .filter(f => f.endsWith('.html'))
      .map(f => {
        const p = path.join(SCREEN_DIR, f);
        return { path: p, mtime: fs.statSync(p).mtime.getTime() };
      })
      .sort((a, b) => b.mtime - a.mtime);
    return files.length > 0 ? files[0].path : null;
  } catch {
    return null;
  }
}

function renderPage() {
  const screenFile = getNewestScreen();
  let html;

  if (!screenFile) {
    html = WAITING_PAGE;
  } else {
    try {
      const raw = fs.readFileSync(screenFile, 'utf-8');
      html = isFullDocument(raw) ? raw : FRAME_TEMPLATE.replace('<!-- CONTENT -->', raw);
    } catch {
      html = WAITING_PAGE;
    }
  }

  if (html.includes('</body>')) {
    html = html.replace('</body>', HELPER_SCRIPT + '\n</body>');
  } else {
    html += HELPER_SCRIPT;
  }
  return html;
}

// ── WebSocket server ────────────────────────────────────────────────────────────

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const wsClients = new Set();

function wsSend(socket, msg) {
  const payload = Buffer.from(msg);
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.alloc(2);
    header[0] = 0x81; // fin + text
    header[1] = len;
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  socket.write(Buffer.concat([header, payload]));
}

function wsParseFrame(buffer) {
  if (buffer.length < 2) return null;
  const masked = (buffer[1] & 0x80) !== 0;
  let payloadLen = buffer[1] & 0x7f;
  let offset = 2;
  if (payloadLen === 126) {
    if (buffer.length < 4) return null;
    payloadLen = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLen === 127) {
    if (buffer.length < 10) return null;
    payloadLen = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }
  if (masked) {
    if (buffer.length < offset + 4 + payloadLen) return null;
    const mask = buffer.slice(offset, offset + 4);
    offset += 4;
    const data = Buffer.alloc(payloadLen);
    for (let i = 0; i < payloadLen; i++) {
      data[i] = buffer[offset + i] ^ mask[i % 4];
    }
    return { opcode: buffer[0] & 0x0f, data, totalLen: offset + payloadLen };
  }
  if (buffer.length < offset + payloadLen) return null;
  return { opcode: buffer[0] & 0x0f, data: buffer.slice(offset, offset + payloadLen), totalLen: offset + payloadLen };
}

function handleWsConnection(socket) {
  wsClients.add(socket);
  let buf = Buffer.alloc(0);

  socket.on('data', (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    while (true) {
      const frame = wsParseFrame(buf);
      if (!frame) break;
      buf = buf.slice(frame.totalLen);

      if (frame.opcode === 0x08) {
        // Close frame
        socket.end();
        return;
      }
      if (frame.opcode === 0x09) {
        // Ping -> Pong
        const pong = Buffer.alloc(2);
        pong[0] = 0x8a; // fin + pong
        pong[1] = 0;
        socket.write(pong);
        continue;
      }
      if (frame.opcode === 0x01) {
        // Text frame — handle user events
        try {
          const event = JSON.parse(frame.data.toString());
          const normalizedEvent = {
            ...event,
            choice: event.choice ?? event.value
          };
          // Server assigns source — prevent client override
          console.log(JSON.stringify({ ...normalizedEvent, source: 'user-event' }));
          if (normalizedEvent.choice != null) {
            const eventsFile = path.join(SCREEN_DIR, '.events');
            fs.appendFileSync(eventsFile, JSON.stringify(normalizedEvent) + '\n');
          }
        } catch {
          // Ignore malformed JSON
        }
      }
    }
  });

  socket.on('close', () => wsClients.delete(socket));
  socket.on('error', () => wsClients.delete(socket));
}

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const client of wsClients) {
    try { wsSend(client, msg); } catch { wsClients.delete(client); }
  }
}

// ── HTTP server ────────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderPage());
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

// WebSocket upgrade
server.on('upgrade', (req, socket, head) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }
  const accept = crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n` +
    '\r\n'
  );
  if (head.length > 0) {
    socket.unshift(head);
  }
  handleWsConnection(socket);
});

// ── File watcher ───────────────────────────────────────────────────────────────

try {
  const watcher = fs.watch(SCREEN_DIR, (eventType, filename) => {
    if (!filename || !filename.endsWith('.html')) return;

    if (eventType === 'rename') {
      // rename fires for both create and delete — check existence
      const filePath = path.join(SCREEN_DIR, filename);
      if (fs.existsSync(filePath)) {
        // New screen — clear events from previous screen
        const eventsFile = path.join(SCREEN_DIR, '.events');
        try { fs.unlinkSync(eventsFile); } catch {}
        console.log(JSON.stringify({ type: 'screen-added', file: filePath }));
        broadcast({ type: 'reload' });
      }
    } else if (eventType === 'change') {
      const filePath = path.join(SCREEN_DIR, filename);
      console.log(JSON.stringify({ type: 'screen-updated', file: filePath }));
      broadcast({ type: 'reload' });
    }
  });
  watcher.on('error', (err) => {
    console.error(JSON.stringify({
      type: 'warning',
      message: 'fs.watch failed, file watching disabled',
      error: err.message
    }));
  });
} catch {
  console.error(JSON.stringify({ type: 'warning', message: 'fs.watch not available, file watching disabled' }));
}

// ── Graceful shutdown ──────────────────────────────────────────────────────────

function shutdown() {
  // Clean up PID file
  const pidFile = path.join(SCREEN_DIR, '.server.pid');
  try { fs.unlinkSync(pidFile); } catch {}

  // Close WebSocket connections
  for (const socket of wsClients) {
    try { socket.end(); } catch {}
  }
  wsClients.clear();

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
