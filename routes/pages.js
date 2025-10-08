const express = require('express');
const router = express.Router();

// Homepage - Shopify audit tool
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Fix My Shopify - AI Store Audit',
    description: 'Get a free AI-powered audit of your Shopify store. Improve SEO, conversion rates, and marketing with actionable insights.'
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// +++ NEW CODE: AI Ad Image Generator page +++
router.get('/ads', (req, res) => {
  // Pass Django base URL and internal API key so the EJS template can hit the backend directly
  const djangoUrl = (process.env.DJANGO_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
  const apiKey = process.env.SHOPIFY_VIEWS_API_KEY || process.env.ENRICHLABS_INTERNAL_API_KEY || '';

  res.render('ads', {
    title: 'AI Ad Image Generator',
    description: 'Generate high-converting ad images for TikTok, Meta & Instagram in one click.',
    djangoUrl,
    apiKey,
  });
});

module.exports = router;
