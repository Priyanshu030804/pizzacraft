import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model('Order', OrderSchema);

async function checkOrderDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const orders = await Order.find().lean();
    console.log('📦 Total orders:', orders.length);
    
    orders.forEach((o, i) => {
      console.log(`\n${i + 1}. Order ${o._id}`);
      console.log('   user_id:', o.user_id, '(type:', typeof o.user_id, ')');
      console.log('   status:', o.status);
      console.log('   total_amount:', o.total_amount);
      console.log('   created_at:', o.created_at);
    });

    // Check current logged-in user ID
    const userId = '691cb03c9d59340d63d3464e';
    console.log('\n🔍 Checking orders for user:', userId);
    const userOrders = await Order.find({ user_id: userId }).lean();
    console.log('Found:', userOrders.length, 'orders');

    // Check with ObjectId
    const userOrdersById = await Order.find({ user_id: new mongoose.Types.ObjectId(userId) }).lean();
    console.log('Found with ObjectId:', userOrdersById.length, 'orders');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkOrderDetails();
