# 🚀 Unified Full-Stack Pizza Delivery App with Razorpay Integration

## ✅ Integration Complete!

Your frontend and backend are now fully connected and can be run as a single unified application. The application now includes Razorpay payment integration with these key features:

### ✅ Payment Features

- Razorpay payment gateway integration
- Multiple payment options (Cards, UPI, Netbanking, Wallets)
- Cash on Delivery fallback option
- Secure payment verification flow
- Test payment credentials included

## 🎯 Quick Start Commands

### Start Everything (Recommended)

```bash
npm start
```

This single command starts both frontend and backend servers together!

### Alternative Startup Methods

- **Windows**: Double-click `start.bat` or `start.ps1`
- **VS Code**: Use Tasks > "Start Full Stack App"
- **Manual**: `npm run dev:full`

## 🌐 Application Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002 (Updated port)
- **Health Check**: http://localhost:3002/api/health
- **Payment API**: http://localhost:3002/api/payment
- **Razorpay Dashboard**: https://dashboard.razorpay.com/app/test

## 🔧 Available Commands

### Development

- `npm start` - Start full application (frontend + backend)
- `npm run dev:frontend` - Frontend only (waits for backend)
- `npm run dev:backend` - Backend only
- `npm stop` - Stop all services
- `npm restart` - Stop and restart everything

### Build & Deploy

- `npm run build:full` - Build everything for production
- `npm run build:backend` - Install backend dependencies
- `npm run build` - Build frontend only

## 🏗️ Integration Features

### ✅ Unified Startup

- Single command starts both servers
- Automatic dependency coordination
- Backend starts first, frontend waits for health check
- Colored output shows which server logs come from

### ✅ Smart Port Management

- Backend: Port 3001
- Frontend: Port 5173
- Health check endpoint for coordination
- Automatic browser opening

### ✅ Development Tools

- VS Code tasks for easy access
- Windows batch files for non-technical users
- PowerShell scripts with better error handling
- Kill-port utility for clean restarts

### ✅ Error Handling

- Backend starts even with database issues
- Frontend waits for backend to be ready
- Clear error messages and troubleshooting

## 📊 Architecture Overview

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐      ┌────────────────┐
│   React Client  │◄────────────────────►│  Express Server │─────►│    Razorpay    │
│   (Port 5173)   │                      │   (Port 3002)   │      │    Payment     │
└─────────────────┘                      └─────────────────┘      │    Gateway     │
         │                                        │               └────────────────┘
         │                                        │                        ▲
         ▼                                        ▼                        │
┌─────────────────┐                      ┌─────────────────┐               │
│   Vite Dev      │                      │   Supabase      │               │
│   Server        │                      │   Database      │               │
└─────────────────┘                      └─────────────────┘               │
                                                                           │
┌─────────────────┐                                                        │
│   Razorpay      │                                                        │
│   Checkout UI   │────────────────────────────────────────────────────────┘
└─────────────────┘
```

## 🔗 Connection Points

### Frontend → Backend

- API calls to `http://localhost:3002/api/*` (Updated port)
- Socket.IO connection for real-time features
- Authentication token passing
- Error handling and retry logic
- Razorpay payment processing requests

### Backend → Razorpay

- Order creation API calls
- Payment verification with crypto signatures
- Test mode using provided credentials

### Backend → Database

- Supabase client connection
- Real-time subscriptions
- Authentication management
- Data persistence
- Order storage with payment details

## 🛠️ VS Code Integration

Use the Command Palette (Ctrl+Shift+P) and search for:

- "Tasks: Run Task" → "Start Full Stack App"
- Or use the default build task (Ctrl+Shift+B)

## 🚨 Troubleshooting

### Common Issues & Solutions

1. **Port Already in Use**

   ```bash
   npm stop
   npm start
   ```

2. **Backend Won't Start**

   - Check `server/.env` configuration
   - Verify Node.js version (18+)
   - Run `npm run build:backend`

3. **Frontend Can't Connect**

   - Ensure backend is running first
   - Check `VITE_API_URL` in `.env`
   - Verify health endpoint: http://localhost:3001/api/health

4. **Database Connection Issues**
   - App will start anyway for development
   - Check Supabase keys in environment files
   - Verify internet connection

### Debug Mode

Run servers separately for debugging:

```bash
# Terminal 1
npm run dev:backend

# Terminal 2 (after backend is running)
npm run dev:frontend
```

## 🎉 Success!

Your pizza delivery app is now a unified full-stack application!

**Features Working:**

- ✅ Unified startup with one command
- ✅ Frontend-backend communication
- ✅ Supabase authentication
- ✅ Real-time features via Socket.IO
- ✅ Development tools and VS Code integration
- ✅ Error handling and recovery
- ✅ Production build process

**Next Steps:**

1. Configure your Supabase service role key for full database features
2. Set up payment integration (Stripe)
3. Configure email services for notifications
4. Deploy to production platforms

Enjoy your unified pizza delivery empire! 🍕
