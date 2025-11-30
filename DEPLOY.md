# Netlify Deployment Guide

## Quick Deploy to Netlify

### Option 1: Deploy via Netlify UI (Recommended)
1. Go to [Netlify](https://www.netlify.com/) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select the repository: `jpashami/hundred-chart-chase`
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 or higher (set in Environment Variables if needed)
6. Click **"Deploy site"**

### Option 2: Deploy via Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from the project directory
netlify deploy --prod
```

When prompted:
- Build command: `npm run build`
- Publish directory: `dist`

### Build Configuration
The project is already configured for Netlify:
- ✅ Build command: `npm run build` (creates production bundle)
- ✅ Output directory: `dist` (Vite default)
- ✅ No environment variables needed
- ✅ All dependencies are in package.json

### Post-Deployment
After deployment, Netlify will provide you with:
- A live URL (e.g., `https://your-site-name.netlify.app`)
- Automatic HTTPS
- Continuous deployment (updates automatically when you push to GitHub)

### Custom Domain (Optional)
To add a custom domain:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the DNS configuration instructions

---

**Note**: The site will be live and publicly accessible once deployed. Perfect for sharing with kids, teachers, and families!
