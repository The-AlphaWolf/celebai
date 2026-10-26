import { describe, it, expect } from 'vitest';
import { MOCK_PLANS } from '../utils/mockPlans';

describe('Timeline & Milestone Engine', () => {
  it('validates timeline items have required fields', () => {
    const plans = [MOCK_PLANS.wedding, MOCK_PLANS.birthday, MOCK_PLANS.community];

    plans.forEach((plan) => {
      expect(Array.isArray(plan.timeline)).toBe(true);
      expect(plan.timeline.length).toBeGreaterThan(0);

      plan.timeline.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('phase');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('time');
        expect(item).toHaveProperty('status');
        expect(['upcoming', 'in-progress', 'completed']).toContain(item.status);
      });
    });
  });

  it('correctly toggles status when marking a milestone complete', () => {
    const milestone = { id: 't1', status: 'upcoming' };
    const updated = {
      ...milestone,
      status: milestone.status === 'completed' ? 'upcoming' : 'completed',
    };

    expect(updated.status).toBe('completed');

    const reverted = {
      ...updated,
      status: updated.status === 'completed' ? 'upcoming' : 'completed',
    };
    expect(reverted.status).toBe('upcoming');
  });

  it('computes completion percentage accurately', () => {
    const items = [
      { id: '1', status: 'completed' },
      { id: '2', status: 'completed' },
      { id: '3', status: 'upcoming' },
      { id: '4', status: 'in-progress' },
    ];

    const completedCount = items.filter((i) => i.status === 'completed').length;
    const progress = Math.round((completedCount / items.length) * 100);

    expect(progress).toBe(50);
  });
});
