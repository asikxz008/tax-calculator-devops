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
  it('exposes a health endpoint', async () => {
    const response = await fetch(`${base}/health`);
    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe('ok');
  });
  it('serves the calculator page', async () => {
    const response = await fetch(base);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(await response.text()).toContain('id="calculator"');
  });
  it('calculates through the API', async () => {
    const response = await post({ income: 100000, deductions: 10000 });
    expect(response.status).toBe(200);
    expect((await response.json()).tax).toBe(13000);
  });
  it('rejects invalid numeric inputs', async () => expect((await post({ income: -1 })).status).toBe(400));
  it('rejects non-object bodies', async () => expect((await post(null)).status).toBe(400));
  it('rejects malformed JSON', async () => {
    const response = await fetch(`${base}/api/calculate`, { method: 'POST',
      headers: { 'Content-Type': 'application/json' }, body: '{' });
    expect(response.status).toBe(400);
  });
  it('rejects unsupported media types', async () => {
    const response = await fetch(`${base}/api/calculate`, { method: 'POST', body: 'income=10' });
    expect(response.status).toBe(415);
  });
  it('rejects oversized bodies', async () => {
    const response = await post({ income: 1, padding: 'a'.repeat(9000) });
    expect(response.status).toBe(413);
  });
  it('returns 404 for unknown paths', async () => expect((await fetch(`${base}/missing`)).status).toBe(404));
});
