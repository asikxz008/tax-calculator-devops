const { createServer } = require('../src/server');
describe('Tax calculator HTTP API', () => {
  let server, base;
  beforeAll(async () => {
    server = createServer();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  });
  afterAll(async () => { await new Promise(resolve => server.close(resolve)); });
  const post = body => fetch(`${base}/api/calculate`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  it('serves the health endpoint and calculator page and rejects unknown paths', async () => {
    const response = await fetch(`${base}/health`);
    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe('ok');
    const page = await fetch(base);
    expect(page.headers.get('content-type')).toContain('text/html');
    expect(await page.text()).toContain('id="calculator"');
    expect((await fetch(`${base}/missing`)).status).toBe(404);
  });
  it('calculates valid API requests and rejects invalid request formats and values', async () => {
    const response = await post({ income: 100000, deductions: 10000 });
    expect(response.status).toBe(200);
    expect((await response.json()).tax).toBe(13000);
    expect((await post({ income: -1 })).status).toBe(400);
    expect((await post(null)).status).toBe(400);
    const malformed = await fetch(`${base}/api/calculate`, { method: 'POST',
      headers: { 'Content-Type': 'application/json' }, body: '{' });
    expect(malformed.status).toBe(400);
    const unsupported = await fetch(`${base}/api/calculate`, { method: 'POST', body: 'income=10' });
    expect(unsupported.status).toBe(415);
    const oversized = await post({ income: 1, padding: 'a'.repeat(9000) });
    expect(oversized.status).toBe(413);
  });
});
