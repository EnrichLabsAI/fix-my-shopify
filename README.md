# Fix My Shopify

AI-powered Shopify store audit and optimization tool. Get actionable insights to improve your store's SEO, conversion rates, and marketing performance.

## Features

- 🔍 **Comprehensive Store Audit**: Analyze SEO, conversion optimization, ad readiness, and social proof
- 🤖 **AI-Powered Insights**: Get personalized recommendations from advanced AI analysis
- 📊 **Growth Score**: Track your store's performance with a 0-100 scoring system
- ✨ **Free Marketing Samples**: Get blog outlines, TikTok hooks, and hero copy suggestions
- 🚀 **Instant Analysis**: Results in seconds, no account required
- 🛡️ **Rate Limited**: 2 audits per IP address every hour (handled by Django backend)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Visit the application:**
   ```
   http://localhost:3000
   ```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DJANGO_API_BASE_URL`: Backend API URL
- `SHOPIFY_VIEWS_API_KEY`: Primary API key for backend communication
- `ENRICHLABS_INTERNAL_API_KEY`: Fallback API key

## API Endpoints

- `GET /`: Main audit interface
- `POST /api/shopify/audit-public-store`: Proxy to Django backend for store analysis
- `GET /health`: Health check endpoint

## Rate Limiting

The application implements IP-based rate limiting via the Django backend to prevent abuse:

- **Limit**: Configurable requests per IP address per hour (currently 2)
- **Storage**: Redis-backed rate limiting in Django backend
- **Response**: HTTP 429 with marketing message encouraging app installation
- **Bypass**: Localhost and whitelisted IPs exempt (via `SHOPIFY_AUDIT_IP_WHITELIST`)

When the limit is exceeded, users receive a branded message promoting the AI Marketing Agent with installation link.

## Technology Stack

- **Frontend**: EJS templating, vanilla JavaScript, CSS
- **Backend**: Node.js, Express.js
- **Proxy**: Connects to Django AI backend
- **Styling**: Custom CSS with dark theme

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## License

MIT License - see LICENSE file for details.
