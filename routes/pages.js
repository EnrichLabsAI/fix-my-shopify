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

module.exports = router;
