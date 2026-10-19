'use strict';
const assert = require('node:assert/strict');
const base = process.env.APP_URL || 'http://127.0.0.1:8080';
(async () => {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(`${base}/health`, { signal: AbortSignal.timeout(5000) });
      if (response.ok && (await response.json()).status === 'ok') { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, 'Application did not become healthy');
  const response = await fetch(`${base}/api/calculate`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ income: 85000, deductions: 5000 }), signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.tax, 11000);
  assert.equal(result.netIncome, 74000);
  console.log(JSON.stringify({ url: base, health: 'ok', calculation: result }, null, 2));
  console.log('SMOKE TEST PASSED');
})().catch(error => { console.error(error); process.exitCode = 1; });
