/**
 * Lighthouse CI configuration for ai-net frontend.
 *
 * Enforced gates (CI must fail):
 *   - Performance:   >= 90
 *   - Accessibility: >= 95
 *   - Best Practices: >= 95
 *   - SEO: >= 90
 *
 * Core Web Vitals and asset thresholds are enforced by the assertions below.
 *
 * Routes tested:
 *   - /        (Landing page — primary entry point)
 *   - /agents  (Agent registry browser — public browsing page)
 */

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx vite preview --host 0.0.0.0 --port 4173',
      startServerReadyPattern: 'Local:',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/agents',
      ],
      numberOfRuns: 2,
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        // Categories
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals thresholds
        'metrics:largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'metrics:cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'metrics:total-blocking-time': ['error', { maxNumericValue: 200 }],

        // Bundle budgets: keep JS and total asset payloads under control.
        'resource-summary:script:size': ['error', { maxNumericValue: 200000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 500000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 4173,
    },
  },
}
