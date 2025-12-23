# Vercel Deployment Guide - Pizza Vamsi Platform

## Overview

This project is now unified into a single deployment with:

- **Main Website**: Served at root `/`
- **Admin Dashboard**: Served at `/admin`
- **Backend API**: Served at `/api/*`
- **Single Server**: Express serves both static React apps and API endpoints

## Pre-Deployment Checklist

### 1. Environment Variables to Set in Vercel

Go to your Vercel project settings → Environment Variables and add:

```env
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pizza?retryWrites=true&w=majority
JWT_SECRET=your_production_jwt_secret_here

# Email Configuration (optional but recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
ADMIN_EMAIL=admin@yoursite.com

# Payment (if using Razorpay)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend URL (will be your Vercel domain)
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### 2. Update .gitignore

Already configured to ignore:

- `.env` files
- `node_modules/`
- `dist/` and `build/`
- Logs and temporary files

### 3. Repository Setup

#### Option A: New Repository (Recommended)

```powershell
# In your project root
git init
git add .
git commit -m "Initial commit: Unified deployment structure"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

#### Option B: Existing Repository

```powershell
git add .
git commit -m "feat: Unified server structure for Vercel deployment"
git push
```

## Vercel Deployment Steps

### Method 1: Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "Add New Project"**
4. **Import your repository**
5. **Configure project:**

   - Framework Preset: `Other`
   - Root Directory: `./` (keep as is)
   - Build Command: `npm run build`
   - Output Directory: leave empty (server handles routing)
   - Install Command: `npm run install:all`

6. **Add Environment Variables** (from the list above)
7. **Click Deploy**

### Method 2: Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd "a:\full stack\projects\pizza vamsi\pizza vamsi"
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: pizza-vamsi (or your choice)
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
# ... add all required vars

# Deploy to production
vercel --prod
```

## Post-Deployment

### 1. Test Your Deployment

Visit your Vercel URL:

- **Main Site**: `https://your-domain.vercel.app/`
- **Admin**: `https://your-domain.vercel.app/admin`
- **API Health**: `https://your-domain.vercel.app/api/health`

### 2. Update CORS Settings

The server is configured to allow your Vercel domain automatically. The dynamic CORS validator accepts:

- Your production domain
- Local development IPs

### 3. Update MongoDB Network Access

In MongoDB Atlas:

1. Go to Network Access
2. Add `0.0.0.0/0` (allow from anywhere) for Vercel
   - Or whitelist Vercel's IP ranges if you prefer

### 4. Test Critical Flows

- [ ] User registration/login
- [ ] Place an order
- [ ] Admin login at `/admin`
- [ ] View orders in admin dashboard
- [ ] Update order status (check real-time sync)

## Architecture

```
Vercel Deployment
│
├── Express Server (project/server/index.js)
│   ├── /api/* → Backend API routes
│   ├── /admin → Serves admin-dashboard/dist (SPA)
│   └── /* → Serves project/dist (SPA)
│
├── Frontend Build (project/dist)
│   └── Main pizza ordering website
│
└── Admin Build (admin-dashboard/dist)
    └── Admin dashboard for order management
```

## Build Process

When you deploy, Vercel will:

1. **Install dependencies**: `npm run install:all`

   - Installs root dependencies
   - Installs project dependencies
   - Installs admin-dashboard dependencies
   - Installs server dependencies

2. **Build frontend**: `npm run build:frontend`

   - Compiles React app to `project/dist`

3. **Build admin**: `npm run build:admin`

   - Compiles admin React app to `admin-dashboard/dist`

4. **Start server**: `node project/server/index.js`
   - Serves both static apps and API

## Troubleshooting

### Build Fails

**Check build logs in Vercel dashboard**

Common issues:

- Missing environment variables → Add in Vercel settings
- TypeScript errors → Fix in code before committing
- Dependency issues → Check package.json versions

### API Routes Not Working

1. Check Environment Variables in Vercel
2. Verify MongoDB connection string
3. Check Vercel function logs

### Admin Dashboard 404

- Ensure `base: '/admin/'` in admin-dashboard/vite.config.ts
- Verify build output exists in `admin-dashboard/dist`
- Check server routing in `project/server/index.js`

### CORS Errors

- Add your Vercel domain to `FRONTEND_URL` environment variable
- Check server CORS configuration accepts production domain

## Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable

## Monitoring

- **Vercel Dashboard**: View deployments, logs, analytics
- **MongoDB Atlas**: Monitor database connections and queries
- **Error Tracking**: Consider adding Sentry or similar

## Rolling Back

If deployment has issues:

```powershell
# Via CLI
vercel rollback

# Or in Vercel dashboard:
# Deployments tab → Find previous working deployment → Promote to Production
```

## Local Testing of Production Build

Before deploying, test locally:

```powershell
# Build everything
npm run build

# Set NODE_ENV
$env:NODE_ENV="production"

# Start server
npm start

# Test at http://localhost:3001
```

## Security Notes

- ✅ Secrets are in environment variables, not code
- ✅ `.gitignore` prevents committing `.env` files
- ✅ Pre-commit hook scans for secrets
- ✅ CORS configured for production domain
- ✅ Rate limiting enabled
- ✅ Helmet security headers applied

## Support

If you encounter issues:

1. Check Vercel build logs
2. Check Vercel function logs (Runtime Logs)
3. Verify all environment variables are set
4. Test API endpoints with `/api/health`

---

**Ready to deploy!** Follow the steps above and your unified platform will be live on Vercel with a single URL serving everything.
