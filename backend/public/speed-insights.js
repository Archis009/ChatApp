/**
 * Vercel Speed Insights Integration
 * 
 * This module initializes Vercel Speed Insights for Express backend.
 * To use in your frontend, import this script as a module:
 * 
 * <script type="module" src="/speed-insights.js"></script>
 * 
 * Or in a React application, use:
 * import { SpeedInsights } from '@vercel/speed-insights/react';
 */

import { injectSpeedInsights } from '/@vercel/speed-insights';

// Initialize Speed Insights with Express framework configuration
injectSpeedInsights({
  framework: 'express',
  debug: process.env.NODE_ENV !== 'production',
});

console.log('Vercel Speed Insights initialized');
