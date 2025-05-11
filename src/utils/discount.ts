export interface DiscountRule {
  condition: (days: number) => boolean;
  rate: number; // 0.1 for 10%
}

export function applyDiscountRules(
  basePrice: number,
  days: number,
  rules = DEFAULT_DISCOUNT_RULES,
): number {
  for (const rule of rules) {
    if (rule.condition(days)) {
      return basePrice * (1 - rule.rate);
    }
  }
  return basePrice;
}

export const DEFAULT_DISCOUNT_RULES: DiscountRule[] = [
  { condition: (d) => d > 10, rate: 0.1 },
];
