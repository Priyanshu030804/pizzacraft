# 🚀 Pre-Deployment Checklist

Complete this checklist before deploying to Vercel.

## ✅ Code Preparation

- [ ] All code changes committed
- [ ] No console.log statements in production code (optional)
- [ ] No hardcoded secrets or API keys in code
- [ ] `.env` file is NOT committed (check .gitignore)
- [ ] All TypeScript errors resolved
- [ ] Build works locally: `npm run build`

## ✅ Environment Variables

Prepare these values to add in Vercel:

### Required

- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong random secret (64+ characters)
- [ ] `FRONTEND_URL` - Will be your Vercel domain (add after first deploy)

### Optional but Recommended

- [ ] `EMAIL_USER` - Gmail or SMTP email
- [ ] `EMAIL_PASS` - App-specific password
- [ ] `ADMIN_EMAIL` - Admin notification email
- [ ] `RAZORPAY_KEY_ID` - Payment gateway key
- [ ] `RAZORPAY_KEY_SECRET` - Payment gateway secret

## ✅ Database Setup (MongoDB Atlas)

- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created with password
- [ ] Network access: Add `0.0.0.0/0` (allow from anywhere)
- [ ] Connection string copied (format: `mongodb+srv://...`)
- [ ] Test connection locally with the string

## ✅ GitHub Repository

- [ ] Repository created on GitHub
- [ ] All files pushed to main branch
- [ ] Repository is public or Vercel has access
- [ ] No sensitive files committed (check with: `git log --all -- .env`)

## ✅ Vercel Account

- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] Connected to GitHub account
- [ ] Billing set up (if needed for team features)

## ✅ Pre-Deployment Test

Run locally in production mode:

```powershell
# Build everything
npm run build

# Start in production mode
$env:NODE_ENV="production"
npm start

# Test these URLs:
# http://localhost:3001/ (main site)
# http://localhost:3001/admin (admin dashboard)
# http://localhost:3001/api/health (API health check)
```

- [ ] Main site loads correctly
- [ ] Admin dashboard accessible at /admin
- [ ] API health check returns OK
- [ ] Can login and place order
- [ ] Admin can view orders

## ✅ Deployment Steps

### 1. Push to GitHub

```powershell
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import to Vercel

- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Framework Preset: **Other**
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `npm run build`
- [ ] Install Command: `npm run install:all`
- [ ] Output Directory: (leave empty)

### 3. Add Environment Variables

- [ ] Click "Environment Variables"
- [ ] Add all required variables from list above
- [ ] Apply to: Production, Preview, Development

### 4. Deploy

- [ ] Click "Deploy"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Note your deployment URL

### 5. Post-Deployment

- [ ] Update `FRONTEND_URL` in Vercel environment variables to your deployment URL
- [ ] Redeploy (Vercel → Deployments → ... → Redeploy)
- [ ] Test all features on production URL

## ✅ Post-Deployment Testing

Test these on your live Vercel URL:

- [ ] Main site loads: `https://your-app.vercel.app/`
- [ ] Admin accessible: `https://your-app.vercel.app/admin`
- [ ] API health: `https://your-app.vercel.app/api/health`
- [ ] User can register
- [ ] User can login
- [ ] User can browse menu
- [ ] User can add to cart
- [ ] User can checkout (test mode payment)
- [ ] Order appears in admin dashboard
- [ ] Admin can update order status
- [ ] Status update reflects in user's orders page
- [ ] Real-time updates work (Socket.IO)

## ✅ Optional Enhancements

- [ ] Add custom domain in Vercel settings
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Enable Vercel Analytics
- [ ] Set up email alerts for errors
- [ ] Configure automatic deployments for main branch
- [ ] Add staging environment (preview branch)

## 🆘 Troubleshooting

### Build Fails

1. Check Vercel build logs
2. Verify all dependencies in package.json
3. Test build locally: `npm run build`
4. Check for TypeScript errors

### 500 Server Error

1. Check Vercel function logs (Runtime Logs)
2. Verify `MONGODB_URI` is correct
3. Check MongoDB network access allows 0.0.0.0/0
4. Verify `JWT_SECRET` is set

### 404 Errors

1. Check vercel.json routes configuration
2. Verify build outputs exist (dist folders)
3. Check server routing in project/server/index.js

### CORS Errors

1. Update `FRONTEND_URL` to include Vercel domain
2. Check CORS configuration in server/index.js
3. Redeploy after env var changes

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Project Docs**: See README.md and VERCEL_DEPLOYMENT.md

---

**Once all items are checked, you're ready to deploy! 🎉**
