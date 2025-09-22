# Deployment Guide

## 🚀 Deploy to Vercel (Recommended - 5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/fix-my-shopify.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Vercel auto-detects Node.js and deploys

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     DJANGO_API_BASE_URL=https://your-django-api.com
     SHOPIFY_VIEWS_API_KEY=your_api_key_here
     NODE_ENV=production
     ```

4. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS setup instructions

### ✅ Done! Your site is live at: `https://fix-my-shopify.vercel.app`

---

## 🚂 Deploy to Railway (Alternative)

### Steps
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   railway init
   railway deploy
   ```

3. **Set Environment Variables:**
   ```bash
   railway variables set DJANGO_API_BASE_URL=https://your-django-api.com
   railway variables set SHOPIFY_VIEWS_API_KEY=your_api_key_here
   ```

---

## 🔧 Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DJANGO_API_BASE_URL` | Your Django backend URL | `https://api.example.com` |
| `SHOPIFY_VIEWS_API_KEY` | API key for Django auth | `your_secret_key` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by host) | `3000` |

---

## 📊 Expected Performance

- **Cold Start**: ~2-3 seconds (first request after idle)
- **Warm Requests**: ~100-300ms response time
- **Rate Limiting**: 2 requests per IP per 15 minutes
- **Concurrent Users**: 100+ (scales automatically)

---

## 🔍 Monitoring & Debugging

### Vercel
- View logs: Vercel Dashboard → Functions → View Function Logs
- Monitor performance: Built-in analytics
- Error tracking: Automatic error reporting

### Health Check
- Endpoint: `https://your-domain.com/health`
- Expected response: `{"status":"ok","timestamp":"..."}`

---

## 🛠 Troubleshooting

### Common Issues

1. **Rate Limiting Not Working:**
   - Check `trust proxy` setting in server.js
   - Verify IP detection in logs

2. **Django API Connection:**
   - Ensure `DJANGO_API_BASE_URL` is correct
   - Check API key is set properly
   - Verify CORS settings on Django

3. **Build Failures:**
   - Check Node.js version (requires 18+)
   - Verify all dependencies are in package.json

### Debug Mode
Set `NODE_ENV=development` to see detailed console logs.
