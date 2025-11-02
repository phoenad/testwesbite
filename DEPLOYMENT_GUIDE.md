# 🚀 Vercel Deployment Guide for G MONAD

## ✅ Pre-Deployment Checklist

Your project is now ready for Vercel deployment! Here's what's been configured:

### Files Created/Updated:
- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Added preview script
- ✅ `.gitignore` - Added dist/ and .vercel

### Project Structure:
```
GMONADwebsite/
├── public/
│   └── images/
│       ├── gmonad.PNG
│       └── optimized/
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vercel.json
└── vite.config.ts
```

## 📦 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your site will be live! 🎉

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Build Configuration

Your `vercel.json` is configured with:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **SPA Routing**: All routes redirect to index.html

## 🌐 Environment Variables (if needed)

If you need environment variables:

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add variables like:
   - `VITE_API_URL`
   - `VITE_TWITTER_HANDLE`
   - etc.

## 📝 Custom Domain Setup

After deployment, to add a custom domain:

1. Go to your project on Vercel
2. Settings → Domains
3. Add your domain (e.g., `gmonad.casino`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### DNS Records for Custom Domain:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 🔍 Testing Before Deployment

Run these commands locally to ensure everything works:

```bash
# Install dependencies
npm install

# Test development build
npm run dev

# Test production build
npm run build
npm run preview
```

Visit `http://localhost:4173` to see the production build.

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Run `npm install` locally
- Test `npm run build` locally

### Images Not Loading
- Ensure images are in `public/images/`
- Check image paths start with `/images/`
- Verify image files are committed to git

### 404 Errors
- The `vercel.json` rewrites should handle this
- If issues persist, check Vercel logs

### Fonts Not Loading
- Fonts are loaded from Google Fonts CDN
- Check `index.html` has font links
- Verify internet connection on deployment

## 📊 Post-Deployment

After successful deployment:

1. **Test the live site**
   - Check all pages load
   - Test mobile responsiveness
   - Verify images load
   - Test social links
   - Check tooltips work

2. **Set up Analytics** (optional)
   - Vercel Analytics (built-in)
   - Google Analytics
   - Mixpanel

3. **Monitor Performance**
   - Vercel Dashboard → Analytics
   - Check Core Web Vitals
   - Monitor load times

## 🎯 Your Deployment URL

After deployment, you'll get:
- **Preview URL**: `your-project-name.vercel.app`
- **Production URL**: `your-project-name.vercel.app`
- **Custom Domain**: `gmonad.casino` (after setup)

## 🔄 Continuous Deployment

Vercel automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for PRs
- ✅ Runs build checks
- ✅ Optimizes images and assets

## 📱 Mobile Testing

After deployment, test on:
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)
- Desktop (Chrome, Firefox, Safari)

## ✨ Optimization Tips

Your site is already optimized with:
- ✅ WebP images (15MB vs 258MB)
- ✅ Responsive design
- ✅ Modern fonts (Space Grotesk + Inter)
- ✅ GSAP animations
- ✅ Tailwind CSS
- ✅ Vite build optimization

## 🎉 You're Ready!

Your G MONAD website is fully configured and ready for Vercel deployment!

**Next Steps:**
1. Push to GitHub
2. Connect to Vercel
3. Deploy
4. Share your live site! 🚀

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev/guide/
- Contact: contact@gmonad.casino
