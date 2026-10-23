# Vercel Speed Insights Configuration

This backend has been configured with Vercel Speed Insights to enable performance monitoring for web applications served by this Express server.

## What's Installed

- **Package**: `@vercel/speed-insights` v2.0.0
- **Static Route**: `/@vercel/speed-insights` serves the Speed Insights module
- **Public Script**: `/speed-insights.js` provides initialization for browser-based apps

## How to Use

### For Frontend Applications Served by This Backend

If your frontend is served from the `frontend/dist` directory in production, you have several options:

#### Option 1: React Applications (Recommended)

Install Speed Insights in your frontend:

```bash
cd frontend
npm install @vercel/speed-insights
```

Then add the component to your main App component:

```javascript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      {/* Your app content */}
      <SpeedInsights />
    </>
  );
}
```

#### Option 2: Using the Backend-Served Script

Add this script tag to your HTML file:

```html
<script type="module" src="/speed-insights.js"></script>
```

This loads the Speed Insights initialization script served from the backend's public directory.

#### Option 3: Manual Import

Import directly from the backend-served module in your JavaScript:

```javascript
import { injectSpeedInsights } from '/@vercel/speed-insights';

injectSpeedInsights({
  framework: 'react', // or 'vue', 'svelte', etc.
});
```

## Backend Configuration

The backend Express server has been configured with:

1. **Static module route**: Serves the Speed Insights package files at `/@vercel/speed-insights/*`
2. **Public directory**: Serves static files including the initialization script
3. **Production-ready**: Automatically works when deployed to Vercel

## Viewing Analytics

Once deployed to Vercel and receiving traffic:

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to the "Speed Insights" tab
4. View Core Web Vitals and performance metrics

## Environment Variables

Speed Insights automatically uses `VERCEL_ANALYTICS_ID` when deployed on Vercel. No manual configuration needed.

## Notes

- Speed Insights measures frontend performance metrics (Core Web Vitals)
- Metrics are only collected when the application is deployed on Vercel
- In development, Speed Insights runs in debug mode (if configured)
- Data appears in the Vercel dashboard after real user visits

## References

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart)
