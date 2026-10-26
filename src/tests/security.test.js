import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  validateNumericRange,
  maskApiKey,
  validatePlanSchema,
} from '../utils/security';
import { MOCK_PLANS } from '../utils/mockPlans';

describe('Security & Input Sanitization Suite', () => {
  describe('sanitizeInput', () => {
    it('escapes dangerous HTML characters to prevent XSS injection', () => {
      const malicious = '<script>alert("pwned")</script><img src=x onerror=alert(1)>';
      const safe = sanitizeInput(malicious);

      expect(safe).not.toContain('<script>');
      expect(safe).not.toContain('<img');
      expect(safe).toContain('&lt;script&gt;');
      expect(safe).toContain('&lt;img');
    });

    it('enforces maximum character lengths to prevent memory exhaustion', () => {
      const longInput = 'A'.repeat(5000);
      const sanitized = sanitizeInput(longInput, 100);

      expect(sanitized.length).toBe(100);
    });

    it('handles non-string values gracefully', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(12345)).toBe('');
    });
  });

  describe('validateNumericRange', () => {
    it('clamps values within safe bounds', () => {
      expect(validateNumericRange(50, 100, 1000, 500)).toBe(100);
      expect(validateNumericRange(5000, 100, 1000, 500)).toBe(1000);
      expect(validateNumericRange(750, 100, 1000, 500)).toBe(750);
    });

    it('falls back to default on invalid non-numeric inputs', () => {
      expect(validateNumericRange('invalid-budget', 100, 1000, 250)).toBe(250);
      expect(validateNumericRange(NaN, 100, 1000, 250)).toBe(250);
    });
  });

  describe('maskApiKey', () => {
    it('safely masks API keys for display without credential leakage', () => {
      const apiKey = 'AIzaSyDnExampleSecretKey1234';
      const masked = maskApiKey(apiKey);

      expect(masked.startsWith('AIzaSy')).toBe(true);
      expect(masked.endsWith('1234')).toBe(true);
      expect(masked).toContain('••••••••');
      expect(masked).not.toContain('ExampleSecretKey');
    });

    it('masks short keys completely', () => {
      expect(maskApiKey('12345')).toBe('••••••••');
      expect(maskApiKey('')).toBe('');
    });
  });

  describe('validatePlanSchema', () => {
    it('approves compliant plan objects', () => {
      expect(validatePlanSchema(MOCK_PLANS.wedding)).toBe(true);
    });

    it('rejects invalid or corrupted plan objects', () => {
      expect(validatePlanSchema(null)).toBe(false);
      expect(validatePlanSchema({})).toBe(false);
      expect(validatePlanSchema({ title: 'No Budget Plan' })).toBe(false);
      expect(validatePlanSchema({ title: 'Plan', budget: -500 })).toBe(false);
    });
  });
});
