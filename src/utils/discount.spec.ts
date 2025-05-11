import { applyDiscountRules, DiscountRule } from './discount';

describe('applyDiscountRules', () => {
  const basePrice = 100;

  it('should apply default 10% discount if days > 10', () => {
    const result = applyDiscountRules(basePrice, 11);
    expect(result).toBe(90); // 100 - 10%
  });

  it('should not apply any discount if days <= 10 (default rule)', () => {
    const result = applyDiscountRules(basePrice, 10);
    expect(result).toBe(100);
  });

  it('should apply custom 20% discount if rule matches', () => {
    const customRules: DiscountRule[] = [
      { condition: (d) => d > 5, rate: 0.2 },
    ];
    const result = applyDiscountRules(basePrice, 6, customRules);
    expect(result).toBe(80); // 100 - 20%
  });

  it('should return basePrice if no custom rule matches', () => {
    const customRules: DiscountRule[] = [
      { condition: (d) => d > 30, rate: 0.3 },
    ];
    const result = applyDiscountRules(basePrice, 10, customRules);
    expect(result).toBe(100);
  });

  it('should apply only the first matching rule', () => {
    const overlappingRules: DiscountRule[] = [
      { condition: (d) => d > 5, rate: 0.2 },
      { condition: (d) => d > 5, rate: 0.5 },
    ];
    const result = applyDiscountRules(basePrice, 6, overlappingRules);
    expect(result).toBe(80); // Only first match applies
  });

  it('should use default rules if rules param is omitted', () => {
    const result = applyDiscountRules(basePrice, 15); // uses DEFAULT_DISCOUNT_RULES
    expect(result).toBe(90);
  });
});
