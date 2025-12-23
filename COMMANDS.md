# 🎯 Quick Command Reference

## 🚀 First Time Setup

```powershell
# Clone and setup
git clone <your-repo>
cd pizza-vamsi
node setup.js

# Or manually:
npm run install:all

# Create .env from template
cp .env.example .env
# Edit .env with your values
```

## 💻 Development

```powershell
# Start all servers (backend + frontend + admin)
npm run dev

# Start individually
npm run dev:backend     # API on :3001
npm run dev:frontend    # Main app on :5173
npm run dev:admin       # Admin on :5001
```

## 🏗️ Build & Test Production

```powershell
# Build everything
npm run build

# Test production locally
$env:NODE_ENV="production"
npm start

# Visit http://localhost:3001
```

## 📦 Individual Builds

```powershell
# Build main frontend
npm run build:frontend

# Build admin dashboard
npm run build:admin

# Install server dependencies
npm run build:server
```

## 🚢 Deployment

### Via Vercel Dashboard

1. Push to GitHub: `git push origin main`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables
5. Deploy!

### Via Vercel CLI

```powershell
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

## 🔧 Git Hooks (Security)

```powershell
# Enable pre-commit secret scanner
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit

# Test it
git add .env
git commit -m "test"  # Should be blocked!
```

## 🐛 Debugging

```powershell
# Check running servers
Get-Process node

# Kill all node processes
Get-Process node | Stop-Process -Force

# Check specific port
netstat -ano | findstr :3001

# Kill process on port
npx kill-port 3001
```

## 📊 MongoDB

```powershell
# Test connection
node -e "import('mongoose').then(m => m.default.connect('your-uri').then(() => console.log('✅ Connected')))"

# Run admin creation script
cd project/server
node scripts/create-admin.js
```

## 🔄 Git Workflow

```powershell
# Initial commit
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main

# Regular updates
git add .
git commit -m "Your message"
git push
```

## 🌐 Environment URLs

### Development

- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5001`
- Backend: `http://localhost:3001`

### Production (after deploy)

- All apps: `https://your-app.vercel.app`
- Admin: `https://your-app.vercel.app/admin`
- API: `https://your-app.vercel.app/api/health`

## 📝 Useful Files

- `README.md` - Project overview
- `VERCEL_DEPLOYMENT.md` - Deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Pre-deploy checklist
- `UNIFIED_DEPLOYMENT_SUMMARY.md` - Architecture details
- `.env.example` - Environment template

## 🆘 Common Issues

### Port in use

```powershell
npx kill-port 3001 5173 5001
```

### Dependencies out of sync

```powershell
rm -rf node_modules
rm -rf project/node_modules
rm -rf admin-dashboard/node_modules
rm -rf project/server/node_modules
npm run install:all
```

### Build fails

```powershell
# Check for TypeScript errors
cd project && npm run build
cd ../admin-dashboard && npm run build
```

### MongoDB connection fails

- Check `MONGODB_URI` in .env
- Verify MongoDB Atlas network access allows your IP
- Test connection string in MongoDB Compass

### Vercel deployment fails

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Test build locally first: `npm run build`

## 🔐 Security Check

```powershell
# Scan for exposed secrets
node scripts/check-secrets.js

# Check what's being committed
git status
git diff --cached

# Verify .gitignore
cat .gitignore
```

## 📊 Monitoring

### Local Logs

```powershell
# Backend logs
cd project && npm run dev:backend

# Watch all logs
npm run dev  # Shows all three servers
```

### Production Logs

- Vercel Dashboard → Your Project → Logs
- Or use Vercel CLI: `vercel logs`

## 🎨 Customize

```powershell
# Update pricing logic
# Edit: project/server/routes/orders.js
# and: project/src/contexts/CartContext.tsx

# Update CORS origins
# Edit: project/server/index.js (allowedOrigins)

# Change ports
# Edit: project/vite.config.ts (port)
# Edit: admin-dashboard/vite.config.ts (port)
```

---

**Keep this handy for quick reference! 📌**
