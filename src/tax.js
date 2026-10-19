'use strict';

// Fictional teaching brackets, in cents. These are not a jurisdiction's tax law.
const BRACKETS = Object.freeze([
  Object.freeze({ limit: 1000000, rate: 0 }),
  Object.freeze({ limit: 4000000, rate: 0.10 }),
  Object.freeze({ limit: 10000000, rate: 0.20 }),
  Object.freeze({ limit: Infinity, rate: 0.30 })
]);

function money(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e12) {
    throw new RangeError(`${label} must be a number between 0 and 1,000,000,000,000.`);
  }
  return Math.round(value * 100);
}

function calculateTax(income, deductions = 0) {
  const incomeCents = money(income, 'Income');
  const deductionCents = money(deductions, 'Deductions');
  const taxableCents = Math.max(0, incomeCents - deductionCents);
  let lower = 0;
  let taxCents = 0;
  const breakdown = BRACKETS.map(({ limit, rate }) => {
    const amount = Math.max(0, Math.min(taxableCents, limit) - lower);
    const tax = Math.round(amount * rate);
    const row = { from: lower / 100, to: Number.isFinite(limit) ? limit / 100 : null,
      rate, taxableAmount: amount / 100, tax: tax / 100 };
    lower = limit;
    taxCents += tax;
    return row;
  });
  return { income: incomeCents / 100, deductions: deductionCents / 100,
    taxableIncome: taxableCents / 100, tax: taxCents / 100,
    netIncome: (incomeCents - taxCents) / 100,
    effectiveRate: incomeCents === 0 ? 0 : taxCents / incomeCents, breakdown };
}

module.exports = { calculateTax };
