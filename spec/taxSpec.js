const { calculateTax } = require('../src/tax');
describe('Progressive tax calculation', () => {
  const examples = [[0, 0], [10000, 0], [10001, 0.10], [40000, 3000],
    [40001, 3000.20], [100000, 15000], [100001, 15000.30], [150000, 30000]];
  it('calculates progressive tax at every bracket boundary', () => {
    for (const [income, expected] of examples) {
      expect(calculateTax(income).tax).withContext(`income ${income}`).toBe(expected);
    }
  });
  it('applies deductions before brackets', () => {
    const result = calculateTax(85000, 5000);
    expect(result.taxableIncome).toBe(80000);
    expect(result.tax).toBe(11000);
    expect(result.netIncome).toBe(74000);
    expect(result.effectiveRate).toBeCloseTo(11000 / 85000, 8);
  });
  it('handles zero income and deductions exceeding income', () => {
    expect(calculateTax(1000, 2000).tax).toBe(0);
    expect(calculateTax(1000, 2000).taxableIncome).toBe(0);
    expect(calculateTax(0).effectiveRate).toBe(0);
  });
  it('rounds to cents and reconciles the bracket breakdown', () => {
    expect(calculateTax(10000.05).tax).toBe(0.01);
    const result = calculateTax(125000);
    expect(result.breakdown.reduce((total, row) => total + row.tax, 0)).toBe(result.tax);
  });
  it('rejects invalid income and deductions', () => {
    for (const invalid of [-1, NaN, Infinity, '50000', null, undefined, 1e13]) {
      expect(() => calculateTax(invalid)).withContext(`income ${String(invalid)}`).toThrowError(RangeError);
    }
    expect(() => calculateTax(50000, -1)).toThrowError(RangeError);
  });
});
