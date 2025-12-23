# 🍕 Pizza Delivery App - Full Stack Application

A complete pizza delivery application with React frontend and Express.js backend, integrated with Supabase for authentication and data management.

## 🚀 Quick Start

### Run the Complete Application (Frontend + Backend)

```bash
npm start
```

This single command will:

- Start the backend server on http://localhost:3001
- Start the frontend development server on http://localhost:5173
- Automatically open your browser to the application

## 📋 Requirements

- Node.js (v18 or higher)
- npm or yarn
- Internet connection (for Supabase)

## 🛠️ Installation & Setup

1. **Clone and Install Dependencies**

   ```bash
   git clone <your-repo-url>
   cd pizza-delivery-app
   npm install
   npm run build:backend
   ```

2. **Environment Configuration**

   The application is pre-configured with Supabase. Environment files are already set up:

   - Frontend: `.env` (contains Supabase URL and keys)
   - Backend: `server/.env` (contains server configuration)

3. **Start the Application**
   ```bash
   npm start
   ```

## 🏗️ Project Structure

```
pizza-delivery-app/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Application pages
│   ├── contexts/                 # React contexts (Auth, Cart)
│   ├── services/                 # API services
│   └── types/                    # TypeScript types
├── server/                       # Backend Express.js application
│   ├── routes/                   # API routes
│   ├── middleware/               # Express middleware
│   ├── services/                 # Backend services
│   └── config/                   # Configuration files
├── supabase/                     # Database migrations
└── package.json                  # Main project configuration
```

## 📱 Available Scripts

### Development

- `npm start` - Run both frontend and backend together
- `npm run dev:frontend` - Run only frontend (port 5173)
- `npm run dev:backend` - Run only backend (port 3001)
- `npm run dev:full` - Run both servers concurrently

### Build & Deploy

- `npm run build` - Build frontend for production
- `npm run build:backend` - Install backend dependencies
- `npm run build:full` - Full build (backend + frontend)

### Utilities

- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌐 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🔧 Features

### Frontend (React + TypeScript)

- ⚡ Vite for fast development
- 🎨 Tailwind CSS for styling
- 🔐 Supabase authentication
- 🛒 Shopping cart functionality
- 📱 Responsive design
- 🔥 Hot module replacement

### Backend (Express.js + Node.js)

- 🚀 RESTful API
- 🔒 JWT authentication
- 📊 Supabase integration
- 🔄 Real-time features (Socket.IO)
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📧 Email services

### Database (Supabase)

- 🗄️ PostgreSQL database
- 🔐 Built-in authentication
- 📝 Real-time subscriptions
- 🔄 Automatic migrations

## 🎯 Authentication Flow

The application uses **Supabase authentication** for a seamless user experience:

1. **Registration**: Users sign up with email/password
2. **Login**: Secure authentication with session management
3. **Profile Management**: User profiles with role-based access
4. **Password Reset**: Email-based password recovery

## 🛒 Core Functionality

- **Menu Browsing**: View available pizzas with filtering
- **Cart Management**: Add/remove items, calculate totals
- **Order Placement**: Complete checkout process
- **Order Tracking**: Real-time order status updates
- **Admin Panel**: Manage menu, orders, and inventory
- **User Profiles**: Manage personal information and order history

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:3001
```

**Backend (server/.env)**

```env
PORT=3002
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
RAZORPAY_KEY_ID=rzp_test_ODQ3lf6JSSFi9z
RAZORPAY_KEY_SECRET=EI21xvagP5DUVcGEl1xtS8AK
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill processes on specific ports
   npx kill-port 3001 5173
   ```

2. **Database Connection Issues**

   - Check Supabase configuration
   - Verify environment variables
   - Ensure internet connection

3. **Authentication Errors**
   - Verify Supabase keys in `.env` files
   - Check browser network tab for API errors

### Development Tips

- Use `npm run dev:backend` and `npm run dev:frontend` separately for debugging
- Check browser console for frontend errors
- Monitor backend logs in the terminal
- Use the health check endpoint: http://localhost:3001/api/health

## � Payment Integration

The application uses Razorpay for online payment processing with the following features:

### Payment Options

- Credit/Debit Cards
- UPI
- Netbanking
- Wallets
- Cash on Delivery (fallback)

### Test Credentials

- Key ID: `rzp_test_ODQ3lf6JSSFi9z`
- Key Secret: `EI21xvagP5DUVcGEl1xtS8AK`

### Testing

For payment testing instructions, refer to `RAZORPAY_TESTING.md` file in the project root.

### Implementation Details

- **Frontend**: React integration with Razorpay checkout.js
- **Backend**: Express routes for order creation and payment verification
- **Security**: Server-side signature verification

## �📦 Dependencies

### Frontend

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Supabase client
- Socket.IO client
- Razorpay SDK (loaded dynamically)

### Backend

- Express.js
- Supabase
- Socket.IO
- JWT
- Bcrypt
- CORS & Helmet
- Razorpay Node SDK

### Development

- Concurrently (run multiple scripts)
- Wait-on (dependency coordination)
- ESLint + TypeScript support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

🍕 **Happy Coding!** Enjoy building your pizza delivery empire!
