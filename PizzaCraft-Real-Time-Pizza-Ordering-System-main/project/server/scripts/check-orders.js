import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const OrderSchema = new mongoose.Schema({}, { strict: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
const Order = mongoose.model('Order', OrderSchema);

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const totalOrders = await Order.countDocuments();
    console.log('📦 Total orders in database:', totalOrders);

    if (totalOrders > 0) {
      const orders = await Order.find().sort({ created_at: -1 }).limit(5).lean();
      console.log('\n📋 Latest 5 orders:');
      orders.forEach((o, i) => {
        console.log(`\n${i + 1}. Order ID: ${o._id}`);
        console.log(`   Status: ${o.status}`);
        console.log(`   User ID: ${o.user_id || 'null'}`);
        console.log(`   Total: ${o.total_amount}`);
        console.log(`   Created: ${o.created_at}`);
        console.log(`   Items: ${o.items?.length || 0}`);
      });
    } else {
      console.log('\n⚠️  No orders found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkOrders();
