Perfect! I've created a complete Next.js analytics dashboard component that captures all the essential logic from the original dashboard. Here's what this component provides:

Key Features Extracted:

1. Site Selection - Dropdown to switch between different sites
2. Time Interval Selection - Today, Yesterday, 24h, 7d, 30d, 90d options
3. Filter Management - Search filters with badges for removal
4. Stats Display - Visitors, Views, Bounce Rate cards
5. Data Visualizations - Time series chart and data tables
6. Loading States - Opacity transitions during data fetching
7. Error Handling - Error boundary equivalent

How to Use:

1. Copy the file to your Next.js project
2. Update the configuration at the top:
   const COUNTERSCALE_API_URL = 'https://your-counterscale.workers.dev';
   const API_SECRET = 'your-api-secret-here';
3. Install dependencies:
   npm install clsx tailwind-merge dayjs recharts lucide-react
   npm install @radix-ui/react-select @radix-ui/react-slot
4. Copy the UI components I listed earlier from the Counterscale project
5. Use in your Next.js app:
   import AnalyticsDashboard from './analytics-dashboard';

export default function AnalyticsPage() {
return (
<AnalyticsDashboard 
        initialSiteId="your-site-id"
        initialInterval="7d" 
      />
);
}

Key Differences from Original:

- React hooks instead of Remix's useLoaderData/useFetcher
- Direct API calls using fetch instead of Remix actions
- Client-side state management instead of URL-based state
- Props-based configuration for API URL and secrets

The component maintains the same layout, functionality, and user experience as the original dashboard while being fully compatible with Next.js!

Required Files to Copy

1. UI Components (Core)

/components/ui/
├── button.tsx
├── card.tsx
├── select.tsx
└── table.tsx

2. Analytics Components

/components/
├── TimeSeriesChart.tsx # Main chart component
├── TableCard.tsx # Data tables
├── PaginatedTableCard.tsx # Tables with pagination
├── PaginationButtons.tsx # Pagination controls
└── SearchFilterBadges.tsx # Filter UI

3. Utility Files

/lib/
├── types.ts # TypeScript interfaces
├── utils.ts # Utility functions
└── cn.ts # Class name utility (if using Tailwind)

4. Dependencies to Install

npm install clsx tailwind-merge dayjs recharts lucide-react
npm install @radix-ui/react-select @radix-ui/react-slot

Example Next.js Page Structure

// pages/analytics.tsx or app/analytics/page.tsx
import { TimeSeriesChart } from '@/components/TimeSeriesChart';
import { TableCard } from '@/components/TableCard';
import { Card } from '@/components/ui/card';

export default function AnalyticsDashboard() {
const [stats, setStats] = useState(null);

    useEffect(() => {
      // Fetch from your API route
      fetch('/api/analytics?endpoint=stats&siteId=your-site')
        .then(res => res.json())
        .then(setStats);
    }, []);

    return (
      <div className="space-y-6">
        {/* Stats cards */}
        <Card>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>Visitors: {stats?.visitors}</div>
              <div>Views: {stats?.views}</div>
              <div>Bounce Rate: {stats?.bounceRate}%</div>
            </div>
          </div>
        </Card>

        {/* Chart */}
        <TimeSeriesChart siteId="your-site" interval="7d" />

        {/* Data tables */}
        <TableCard endpoint="paths" title="Top Pages" />
        <TableCard endpoint="referrers" title="Top Referrers" />
      </div>
    );

}

Optional Files (if you want full functionality)

Dashboard Layout

- app/routes/dashboard.tsx - Main dashboard layout
- app/root.tsx - Root app structure (adapt for Next.js)

Styling

- tailwind.config.ts - Tailwind configuration
- CSS files for styling

The core components (TimeSeriesChart, TableCard, PaginatedTableCard) are designed to be framework-agnostic and should work well in Next.js with minimal modifications. You'll mainly need to:

1. Replace Remix's useFetcher with Next.js data fetching (SWR, React Query, or useState/useEffect)
2. Update import paths to match your Next.js project structure
3. Ensure Tailwind CSS is configured properly

Files Created

1. /app/lib/auth.ts - Authentication middleware for API key validation
2. /app/routes/api.analytics.tsx - Main API route for analytics data
3. Updated wrangler.json - Added API_SECRET environment variable

Usage

Authentication

The API accepts authentication via two methods:

- Bearer token: Authorization: Bearer your-secret-key
- API Key header: X-API-Key: your-secret-key

API Endpoints

Base URL: https://your-counterscale.workers.dev/api/analytics

Query Parameters:

- siteId (required) - Your site ID
- endpoint - Data type to fetch (default: "stats")
- interval - Time range (default: "24h")
- timezone - Timezone (default: "UTC")
- limit - Results limit for paginated endpoints (default: 10)
- offset - Results offset for pagination (default: 0)

Available Endpoints

// Overall stats
GET /api/analytics?siteId=site123&endpoint=stats

// Time series data for charts
GET /api/analytics?siteId=site123&endpoint=timeseries&interval=7d

// Top pages
GET /api/analytics?siteId=site123&endpoint=paths&limit=20

// Referrers
GET /api/analytics?siteId=site123&endpoint=referrers

// Geographic data
GET /api/analytics?siteId=site123&endpoint=countries

// Browser data
GET /api/analytics?siteId=site123&endpoint=browsers

// Device data
GET /api/analytics?siteId=site123&endpoint=devices

// Event data (new!)
GET /api/analytics?siteId=site123&endpoint=events

Setup Instructions

1. Update your shared secret in wrangler.json:
   "vars": {
   "API_SECRET": "your-actual-secret-key-here"
   }
2. Deploy the updated Counterscale:
   npm run deploy
3. Use in your Next.js project:
   // In your Next.js API route
   const response = await fetch(
   'https://your-counterscale.workers.dev/api/analytics?siteId=your-site&endpoint=stats',
   {
   headers: {
   'Authorization': 'Bearer your-secret-key'
   }
   }
   );
   const data = await response.json();

The API includes CORS headers and caching, so it's ready for cross-origin requests from your Next.js app!

# Counterscale

![](/packages/server/public/counterscale-logo-300x300.webp)

![ci status](https://github.com/benvinegar/counterscale/actions/workflows/ci.yaml/badge.svg)
[![License](https://img.shields.io/github/license/benvinegar/counterscale)](https://github.com/benvinegar/counterscale/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/benvinegar/counterscale/graph/badge.svg?token=NUHURNB682)](https://codecov.io/gh/benvinegar/counterscale)

Counterscale is a simple web analytics tracker and dashboard that you self-host on Cloudflare.

It's designed to be easy to deploy and maintain, and should cost you near-zero to operate – even at high levels of traffic (Cloudflare's [free tier](https://developers.cloudflare.com/workers/platform/pricing/#workers) could hypothetically support up to 100k hits/day).

## License

Counterscale is free, open source software made available under the MIT license. See: [LICENSE](LICENSE).

## Limitations

Counterscale is powered primarily by Cloudflare Workers and [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/). As of February 2025, Workers Analytics Engine has _maximum 90 days retention_, which means Counterscale can only show the last 90 days of recorded data.

## Installation

### Requirements

- macOS or Linux environment
- Node v20 or above
- An active [Cloudflare](https://cloudflare.com) account (either free or paid)

### Cloudflare Preparation

If you don't have one already, [create a Cloudflare account here](https://dash.cloudflare.com/sign-up) and verify your email address.

1. Go to your Cloudflare dashboard and, if you do not already have one, set up a [Cloudflare Workers subdomain](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
1. Enable [Cloudflare Analytics Engine beta](https://developers.cloudflare.com/analytics/analytics-engine/get-started/) for your account ([screenshot](https://github.com/benvinegar/counterscale/assets/4562878/ad1b5712-2344-4489-a684-685b876635d1))
    1. If this is your first time using Workers, you have to create a Worker before you can enable the Analytics Engine. Navigate to Workers & Pages > Overview, click the "Create Worker" button ([screenshot](./docs/create-worker.png)) to create a "Hello World" worker (it doesn't matter what you name this Worker as you can delete it later).
1. Create a [Cloudflare API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/). This token needs `Account.Account Analytics` permissions at a minimum ([screenshot](./docs/api-token.png)).
    - _WARNING: Keep this window open or copy your API token somewhere safe (e.g. a password manager), because if you close this window you will not be able to access this API token again and have to start over._

### Deploy Counterscale

First, sign into Cloudflare and authorize the Cloudflare CLI (Wrangler) using:

```bash
npx wrangler login
```

Afterwards, run the Counterscale installer:

```bash
npx @counterscale/cli@latest install
```

Follow the prompts. You will be asked for the Cloudflare API token you created earlier.

Once the script has finished, the server application should be deployed. Visit `https://{subdomain-emitted-during-deploy}.workers.dev` to verify.

NOTE: _If this is your first time deploying Counterscale, it may take take a few minutes before the Worker subdomain becomes live._

### Start Recording Web Traffic from Your Website(s)

You can load the tracking code using one of two methods:

#### 1. Script Loader (CDN)

When Counterscale is deployed, it makes `tracker.js` available at the URL you deployed to:

```
https://{subdomain-emitted-during-deploy}.workers.dev/tracker.js
```

To start reporting website traffic from your web property, copy/paste the following snippet into your website HTML:

```html
<script
    id="counterscale-script"
    data-site-id="your-unique-site-id"
    src="https://{subdomain-emitted-during-deploy}.workers.dev/tracker.js"
    defer
></script>
```

#### 2. Package/Module

The Counterscale tracker is published as an npm module:

```bash
npm install @counterscale/tracker
```

Initialize Counterscale with your site ID and the URL of your deployed reporting endpoint:

```typescript
import * as Counterscale from "@counterscale/tracker";

Counterscale.init({
    siteId: "your-unique-site-id",
    reporterUrl:
        "https://{subdomain-emitted-during-deploy}.workers.dev/collect",
});
```

## Upgrading

For most releases, upgrading is as simple as re-running the CLI installer:

```bash
npx @counterscale/cli@latest install

# OR
# npx @counterscale/cli@VERSION install
```

You won't have to enter a new API key, and your data will carry forrward.

Counterscale uses [semantic versioning](https://semver.org/). If upgrading to a major version (e.g. 2.x, 3.x, 4.x), there may be extra steps. Please consult the [release notes](https://github.com/benvinegar/counterscale/releases).

## Troubleshooting

If the website is not immediately available (e.g. "Secure Connection Failed"), it could be because Cloudflare has not yet activated your subdomain (yoursubdomain.workers.dev). This process can take a minute; you can check in on the progress by visiting the newly created worker in your Cloudflare dashboard (Workers & Pages → counterscale).

## Advanced

### Manually Track Pageviews

When you initialize the Counterscale tracker, set `autoTrackPageviews` to `false`. Then, you can manually call `Counterscale.trackPageview()` when you want to record a pageview.

```typescript
import * as Counterscale from "@counterscale/tracker";

Counterscale.init({
    siteId: "your-unique-site-id",
    reporterUrl:
        "https://{subdomain-emitted-during-deploy}.workers.dev/collect",
    autoTrackPageviews: false, // <- don't forget this
});

// ... when a pageview happens
Counterscale.trackPageview();
```

### Event Tracking

Track custom events like clicks, downloads, form submissions, and user interactions:

```typescript
// Simple event
Counterscale.trackEvent({
    name: "button_click",
});

// Event with properties and metadata
Counterscale.trackEvent({
    name: "download",
    properties: {
        filename: "report.pdf",
        size: 1024000,
    },
    category: "engagement",
    target: "download-btn",
    value: 10,
});

// Click tracking example
document.querySelector("#signup-btn").addEventListener("click", (e) => {
    Counterscale.trackEvent({
        name: "signup_click",
        target: e.target.id,
        category: "conversion",
    });
});

// Scroll tracking example
let scrollTracked = false;
window.addEventListener("scroll", () => {
    if (!scrollTracked && window.scrollY > window.innerHeight * 0.75) {
        Counterscale.trackEvent({
            name: "scroll_75_percent",
            category: "engagement",
        });
        scrollTracked = true;
    }
});
```

#### Event Parameters

- `name` (required): Event identifier (e.g., 'button_click', 'download')
- `properties` (optional): Object with custom data that gets JSON-serialized
- `category` (optional): Event grouping (e.g., 'engagement', 'conversion')
- `target` (optional): Element identifier or target description
- `value` (optional): Numeric value associated with the event

### Custom Domains

The deployment URL can always be changed to go behind a custom domain you own. [More here](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

## Development

See [Contributing](CONTRIBUTING.md) for information on how to get started.

## Notes

### Database

There is only one "database": the Cloudflare Analytics Engine dataset, which is communicated entirely over HTTP using Cloudflare's API.

Right now there is no local "test" database. This means in local development:

- Writes will no-op (no hits will be recorded)
- Reads will be read from the production Analaytics Engine dataset (local development shows production data)

### Sampling

Cloudflare Analytics Engine uses sampling to make high volume data ingestion/querying affordable at scale (this is similar to most other analytics tools, see [Google Analytics on Sampling](https://support.google.com/analytics/answer/2637192?hl=en#zippy=%2Cin-this-article)). You can find out more how [sampling works with CF AE here](https://developers.cloudflare.com/analytics/analytics-engine/sampling/).
