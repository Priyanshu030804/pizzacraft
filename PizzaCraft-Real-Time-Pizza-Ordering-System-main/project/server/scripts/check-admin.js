import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const UserSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  password_hash: { type: String },
  phone: { type: String },
  role: { type: String },
  email_verified: { type: Boolean }
}, { strict: false });

const User = mongoose.model('User', UserSchema);

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@pizzaapp.com' }).lean();
    
    if (!admin) {
      console.log('❌ Admin user not found');
    } else {
      console.log('\n📧 Email:', admin.email);
      console.log('👤 Role:', admin.role);
      console.log('🔑 Has password_hash:', !!admin.password_hash);
      console.log('✅ Email verified:', admin.email_verified);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkAdmin();
