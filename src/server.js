'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { calculateTax } = require('./tax');

const assets = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/style.css': ['style.css', 'text/css; charset=utf-8']
};
function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'",
    'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (req.method === 'GET' && url.pathname === '/health') {
        return send(res, 200, { status: 'ok', application: 'tax-calculator', version: '1.0.0' });
      }
      if (req.method === 'GET' && assets[url.pathname]) {
        const [file, type] = assets[url.pathname];
        return send(res, 200, await fs.readFile(path.join(__dirname, '..', 'public', file), 'utf8'), type);
      }
      if (req.method === 'POST' && url.pathname === '/api/calculate') {
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) {
          return send(res, 415, { error: 'Use application/json.' });
        }
        let raw = '';
        for await (const chunk of req) {
          raw += chunk;
          if (Buffer.byteLength(raw) > 8192) return send(res, 413, { error: 'Request too large.' });
        }
        let data;
        try { data = JSON.parse(raw); } catch { return send(res, 400, { error: 'Invalid JSON.' }); }
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          return send(res, 400, { error: 'Expected a JSON object.' });
        }
        try { return send(res, 200, calculateTax(data.income, data.deductions)); }
        catch (error) { return send(res, 400, { error: error.message }); }
      }
      send(res, 404, { error: 'Not found.' });
    } catch (error) {
      console.error('Request failed:', error.message);
      if (!res.headersSent) send(res, 500, { error: 'Internal server error.' });
      else res.end();
    }
  });
}
if (require.main === module) {
  const server = createServer();
  const port = Number(process.env.PORT || 8080);
  server.listen(port, '0.0.0.0', () => console.log(`Tax calculator listening on port ${port}`));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
  process.on('SIGINT', () => server.close(() => process.exit(0)));
}
module.exports = { createServer };
