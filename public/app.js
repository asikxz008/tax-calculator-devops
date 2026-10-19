'use strict';
const form = document.querySelector('#calculator');
const errorBox = document.querySelector('#error');
const button = document.querySelector('#calculate');
const usd = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
async function calculate(event) {
  if (event) event.preventDefault();
  if (!form.reportValidity()) return;
  errorBox.textContent = '';
  button.disabled = true;
  try {
    const response = await fetch('/api/calculate', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ income: Number(document.querySelector('#income').value), deductions: Number(document.querySelector('#deductions').value) }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Calculation failed.');
    document.querySelector('#tax').textContent = usd(data.tax);
    document.querySelector('#net').textContent = usd(data.netIncome);
    document.querySelector('#taxable').textContent = usd(data.taxableIncome);
    document.querySelector('#rate').textContent = `${(data.effectiveRate * 100).toFixed(2)}%`;
    const body = document.querySelector('#brackets');
    body.replaceChildren(...data.breakdown.map(row => {
      const tr = document.createElement('tr');
      const label = row.to === null ? `${usd(row.from)}+` : `${usd(row.from)} – ${usd(row.to)}`;
      for (const value of [label, `${row.rate * 100}%`, usd(row.tax)]) {
        const td = document.createElement('td'); td.textContent = value; tr.append(td);
      }
      return tr;
    }));
  } catch (error) { errorBox.textContent = error.message; }
  finally { button.disabled = false; }
}
form.addEventListener('submit', calculate);
calculate();
