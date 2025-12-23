# PizzaCraft Admin Dashboard

A real-time admin dashboard for managing PizzaCraft orders and customers.

## Features

- **Real-time Order Management**: View and update order status in real-time
- **Order Status Updates**: Change order status from pending → confirmed → preparing → out-for-delivery → delivered
- **Customer Management**: View customer details, order history, and statistics
- **Dashboard Analytics**: Overview of key metrics including total orders, revenue, and customer count
- **Cross-Domain Sync**: Synchronizes with the main PizzaCraft website for real-time updates

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the admin dashboard directory:
```bash
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:3001`

### Login Credentials

- **Email**: admin@pizzacraft.com
- **Password**: admin123

## Real-time Synchronization

The admin dashboard automatically synchronizes with the main PizzaCraft website through:

1. **LocalStorage Sync**: Shares order data through browser localStorage
2. **Cross-Origin Communication**: Uses postMessage API for real-time updates
3. **Event-driven Updates**: Listens for storage events and custom events

### How It Works

1. When a customer places an order on the main website, it appears instantly in the admin dashboard
2. When an admin updates an order status, the change reflects immediately on the customer's order page
3. All data is synchronized across both applications in real-time

## Order Status Flow

1. **Pending** → Order received, waiting for confirmation
2. **Confirmed** → Order confirmed by admin
3. **Preparing** → Kitchen is preparing the order
4. **Out for Delivery** → Order is out for delivery
5. **Delivered** → Order has been delivered to customer

## Pages

### Dashboard
- Overview of key metrics
- Recent orders summary
- Quick statistics

### Orders
- Complete order management
- Status update buttons
- Order details and customer information
- Real-time order filtering

### Customers
- Customer database
- Order history per customer
- Customer statistics and contact information

## Technical Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Vite** for build tooling

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── pages/             # Main application pages
│   ├── services/          # Business logic and API services
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application component
├── public/                # Static assets
└── package.json           # Project dependencies
```

## Development

### Adding New Features

1. **New Pages**: Add to `src/pages/` and update the navigation in `App.tsx`
2. **New Services**: Add to `src/services/` for business logic
3. **New Components**: Add to `src/components/` for reusable UI elements

### Real-time Features

To add new real-time features:

1. Use the `OrderSyncService` for order-related synchronization
2. Extend the `WebsiteConnectionService` for cross-origin communication
3. Add event listeners in components for real-time updates

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to your web server

3. Ensure both the main website and admin dashboard are on the same domain for full synchronization features

## Security Notes

- In production, implement proper authentication and authorization
- Add CORS protection and origin validation
- Use HTTPS for all communications
- Implement rate limiting and input validation
