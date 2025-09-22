const express = require('express');
const router = express.Router();

// Use global fetch (Node >=18). Fallback to dynamic import if unavailable.
const fetchFn = globalThis.fetch || ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));

// Shopify store audit endpoint
router.post('/shopify/audit-public-store', async (req, res) => {
  try {
    const { store_url } = req.body || {};
    if (!store_url) {
      return res.status(400).json({ status: 'error', message: 'store_url is required' });
    }

    // Get API key and Django base URL from environment
    const apiKey = process.env.SHOPIFY_VIEWS_API_KEY || process.env.ENRICHLABS_INTERNAL_API_KEY || '';
    const djangoBase = process.env.DJANGO_API_BASE_URL || 'http://localhost:8000';

    if (!apiKey) {
      console.warn('⚠️  No API key found. Set SHOPIFY_VIEWS_API_KEY or ENRICHLABS_INTERNAL_API_KEY');
    }

    // Django mounts app URLs under /ai_coordinator/
    const resp = await fetchFn(`${djangoBase}/ai_coordinator/experiments/audit-public-store/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({ store_url })
    });

    // Check if response is JSON
    const contentType = (resp.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('application/json')) {
      const data = await resp.json();
      res.status(resp.status).json(data);
    } else {
      // Handle non-JSON responses (likely errors)
      const text = await resp.text();
      console.error('Django returned non-JSON response:', text.substring(0, 500));
      res.status(502).json({ 
        status: 'error', 
        message: `Django returned non-JSON response. Check server logs for details.` 
      });
    }
  } catch (error) {
    console.error('Error in Shopify audit proxy:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
