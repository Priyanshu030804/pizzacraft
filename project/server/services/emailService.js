import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'development') {
    // For development, log emails instead of sending
    return {
      sendMail: async (options) => {
        console.log('📧 Email would be sent:');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html || options.text);
        return { messageId: 'dev-' + Date.now() };
      }
    };
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const transporter = createTransporter();

// Email templates
const emailTemplates = {
  verification: (token) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF9800;">Welcome to PizzaCraft!</h2>
      <p>Thank you for joining PizzaCraft. Please verify your email address to complete your registration.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" 
           style="background-color: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">
        ${process.env.FRONTEND_URL}/verify-email?token=${token}
      </p>
      <p>This link will expire in 24 hours.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        If you didn't create an account with PizzaCraft, you can safely ignore this email.
      </p>
    </div>
  `,

  passwordReset: (token) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF9800;">Reset Your Password</h2>
      <p>We received a request to reset your password for your PizzaCraft account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" 
           style="background-color: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">
        ${process.env.FRONTEND_URL}/reset-password?token=${token}
      </p>
      <p>This link will expire in 1 hour.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
  `,

  orderConfirmation: (order) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF9800;">Order Confirmation</h2>
      <p>Thank you for your order! We've received it and will start preparing your delicious pizza.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Estimated Delivery:</strong> ${new Date(order.estimated_delivery).toLocaleString()}</p>
      </div>

      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #4CAF50;">Delivery Address</h3>
        <p style="margin: 0;">
          ${order.delivery_address.street}<br>
          ${order.delivery_address.city}, ${order.delivery_address.state} ${order.delivery_address.zipCode}
        </p>
      </div>

      <p>You can track your order status in real-time by visiting your orders page on our website.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/orders" 
           style="background-color: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Track Your Order
        </a>
      </div>
    </div>
  `,

  orderStatus: (order) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF9800;">Order Status Update</h2>
      <p>Your order status has been updated!</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order #${order.id}</h3>
        <p><strong>New Status:</strong> <span style="color: #4CAF50; text-transform: capitalize;">${order.status}</span></p>
        ${order.estimated_delivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimated_delivery).toLocaleString()}</p>` : ''}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/orders/${order.id}" 
           style="background-color: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Order Details
        </a>
      </div>
    </div>
  `,

  lowInventory: (item) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #F44336;">Low Inventory Alert</h2>
      <p>The following inventory item is running low and needs to be restocked:</p>
      
      <div style="background-color: #ffebee; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #F44336;">
        <h3 style="margin-top: 0; color: #F44336;">${item.name}</h3>
        <p><strong>Current Stock:</strong> ${item.quantity} ${item.unit}</p>
        <p><strong>Minimum Required:</strong> ${item.min_quantity} ${item.unit}</p>
        <p><strong>Type:</strong> ${item.type}</p>
        ${item.supplier ? `<p><strong>Supplier:</strong> ${item.supplier}</p>` : ''}
      </div>

      <p>Please restock this item as soon as possible to avoid running out of stock.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/admin/inventory" 
           style="background-color: #F44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Manage Inventory
        </a>
      </div>
    </div>
  `,

  welcome: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🍕 Welcome to PizzaCraft India!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Namaste ${user.firstName}! Your pizza journey begins here</p>
      </div>

      <!-- Welcome Content -->
      <div style="padding: 30px 20px;">
        <h2 style="color: #FF6B35; margin-bottom: 20px;">स्वागत है! Welcome to India's Best Pizza Experience! 🇮🇳</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          We're thrilled to have you join the PizzaCraft family! Get ready to experience authentic Italian flavors 
          with an Indian twist, delivered fresh to your doorstep.
        </p>

        <!-- Special Offers for Indian Market -->
        <div style="background-color: #FFF3E0; border: 2px solid #FF6B35; border-radius: 10px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #FF6B35; margin-top: 0;">🎉 Welcome Offers Just for You!</h3>
          <ul style="color: #333; line-height: 1.8;">
            <li><strong>FREE DELIVERY</strong> on your first order (min. order ₹499)</li>
            <li><strong>20% OFF</strong> your first pizza with code: <code style="background: #FF6B35; color: white; padding: 2px 8px; border-radius: 3px;">WELCOME20</code></li>
            <li><strong>Cash on Delivery (COD)</strong> available - No payment hassles!</li>
            <li><strong>Real-time order tracking</strong> via SMS & WhatsApp</li>
          </ul>
        </div>

        <!-- Popular in India Section -->
        <div style="margin: 30px 0;">
          <h3 style="color: #FF6B35;">🌟 Popular Pizzas in India</h3>
          <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Margherita Classic</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">Starting from ₹299</p>
            </div>
            <div style="flex: 1; min-width: 200px; background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Paneer Tikka Special</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">Starting from ₹399</p>
            </div>
          </div>
        </div>

        <!-- Contact & Support -->
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #FF6B35; margin-top: 0;">Need Help? We're Here for You! 🤝</h3>
          <p style="margin: 10px 0; color: #333;">
            <strong>Customer Support:</strong> 📞 1800-123-PIZZA (7492)<br>
            <strong>WhatsApp:</strong> 📱 +91-98765-43210<br>
            <strong>Email:</strong> 📧 support@pizzacraft.in<br>
            <strong>Hours:</strong> 🕐 10:00 AM - 11:00 PM (All days)
          </p>
        </div>

        <!-- CTA Buttons -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.FRONTEND_URL}/menu" 
             style="background-color: #FF6B35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 16px; margin: 0 10px 10px 0;">
            🍕 Order Your First Pizza
          </a>
          <a href="${process.env.FRONTEND_URL}/profile" 
             style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 16px; margin: 0 10px 10px 0;">
            📱 Complete Your Profile
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">
          Thank you for choosing PizzaCraft India! 🍕❤️<br>
          Your satisfaction is our priority. Happy ordering!
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #ccc;">
          If you have any questions, reply to this email or contact our support team.
        </p>
      </div>
    </div>
  `
};

// Email sending functions
export const sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your PizzaCraft Account',
    html: emailTemplates.verification(token)
  };

  return await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your PizzaCraft Password',
    html: emailTemplates.passwordReset(token)
  };

  return await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (email, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation - #${order.id}`,
    html: emailTemplates.orderConfirmation(order)
  };

  return await transporter.sendMail(mailOptions);
};

export const sendOrderStatusEmail = async (email, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Update - #${order.id}`,
    html: emailTemplates.orderStatus(order)
  };

  return await transporter.sendMail(mailOptions);
};

export const sendLowInventoryAlert = async (item) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `Low Inventory Alert - ${item.name}`,
    html: emailTemplates.lowInventory(item)
  };

  return await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email, user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🍕 Welcome to PizzaCraft India - Your Pizza Journey Begins!',
    html: emailTemplates.welcome(user)
  };

  return await transporter.sendMail(mailOptions);
};