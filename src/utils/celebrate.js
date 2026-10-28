/** Confetti burst, loaded on demand and skipped for users who prefer reduced motion. */
export async function celebrate(options = {}) {
  if (typeof window === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const { default: confetti } = await import('canvas-confetti');
  confetti({ particleCount: 60, spread: 70, origin: { y: 0.3 }, disableForReducedMotion: true, ...options });
}
