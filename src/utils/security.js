/**
 * Security & Input Sanitization Engine for CelebAI
 * Ensures safe handling of user inputs, prevention of XSS vulnerabilities,
 * and secure credential handling.
 */

/**
 * Sanitizes user input string against HTML/Script injection attacks
 * @param {string} input 
 * @param {number} maxLength 
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input, maxLength = 2000) {
  if (typeof input !== 'string') return '';
  
  // Truncate to maximum permissible length to prevent buffer/memory exhaustion attacks
  let sanitized = input.slice(0, maxLength);
  
  // Replace HTML special characters with safe entity representations
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized.trim();
}

/**
 * Validates and normalizes numerical event inputs (budget, guest count)
 * @param {number|string} value 
 * @param {number} min 
 * @param {number} max 
 * @param {number} fallback 
 * @returns {number}
 */
export function validateNumericRange(value, min = 1, max = 10000000, fallback = 1000) {
  const parsed = Number(value);
  if (isNaN(parsed) || !isFinite(parsed)) return fallback;
  if (parsed < min) return min;
  if (parsed > max) return max;
  return Math.round(parsed);
}

/**
 * Masks sensitive API keys for safe UI presentation
 * @param {string} key 
 * @returns {string} e.g. "AIzaSy•••••••••7x9B"
 */
export function maskApiKey(key) {
  if (!key || typeof key !== 'string') return '';
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '••••••••';
  const prefix = trimmed.slice(0, 6);
  const suffix = trimmed.slice(-4);
  return `${prefix}${'•'.repeat(8)}${suffix}`;
}

/**
 * Validates plan JSON structure against expected schema
 * @param {any} plan 
 * @returns {boolean}
 */
export function validatePlanSchema(plan) {
  if (!plan || typeof plan !== 'object') return false;
  if (typeof plan.title !== 'string' || plan.title.trim().length === 0) return false;
  if (typeof plan.budget !== 'number' || plan.budget <= 0) return false;
  if (!Array.isArray(plan.budgetItems)) return false;
  if (!Array.isArray(plan.timeline)) return false;
  if (!Array.isArray(plan.vendors)) return false;
  return true;
}
