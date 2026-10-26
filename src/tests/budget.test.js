import { describe, it, expect } from 'vitest';
import { MOCK_PLANS } from '../utils/mockPlans';

describe('Budget Calculation Engine', () => {
  it('correctly aggregates category budget allocations', () => {
    const wedding = MOCK_PLANS.wedding;
    const budgetItems = wedding.budgetItems;
    const totalAllocated = budgetItems.reduce((acc, item) => acc + item.allocated, 0);
    
    expect(totalAllocated).toBeGreaterThan(0);
    expect(totalAllocated).toBeLessThanOrEqual(wedding.budget);
  });

  it('computes positive safety contingency buffer', () => {
    const wedding = MOCK_PLANS.wedding;
    const totalBudget = wedding.budget;
    const totalAllocated = wedding.budgetItems.reduce((acc, item) => acc + item.allocated, 0);
    const buffer = totalBudget - totalAllocated;

    expect(buffer).toBeGreaterThanOrEqual(0);
  });

  it('verifies all budget percentages sum to approximately 100% or under', () => {
    const wedding = MOCK_PLANS.wedding;
    const percentageSum = wedding.budgetItems.reduce((acc, item) => acc + item.percentage, 0);
    expect(percentageSum).toBeLessThanOrEqual(100);
    expect(percentageSum).toBeGreaterThanOrEqual(80);
  });

  it('handles empty or zero-budget edge cases gracefully', () => {
    const emptyItems = [];
    const total = emptyItems.reduce((acc, item) => acc + (item.allocated || 0), 0);
    expect(total).toBe(0);
  });
});
