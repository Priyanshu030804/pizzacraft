import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String },
  password: { type: String },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
  email_verified: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function fixAdminPassword() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@pizzaapp.com';
    const adminPassword = 'admin123';

    // Find admin user
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new one...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await User.create({
        first_name: 'Admin',
        last_name: 'User',
        email: adminEmail,
        password_hash: hashedPassword,
        phone: '1234567890',
        role: 'admin',
        email_verified: true
      });
      
      console.log('✅ New admin user created');
    } else {
      console.log('📝 Current admin fields:', Object.keys(admin.toObject()));
      console.log('🔑 Has password_hash:', !!admin.password_hash);
      console.log('🔑 Has password:', !!admin.password);
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Update with correct field and remove wrong field
      await User.updateOne(
        { email: adminEmail },
        { 
          $set: { 
            password_hash: hashedPassword,
            role: 'admin',
            email_verified: true
          },
          $unset: { password: "" }
        }
      );
      
      console.log('✅ Admin password updated with password_hash field');
      
      // Verify
      const updated = await User.findOne({ email: adminEmail }).lean();
      console.log('✅ Verified - Has password_hash:', !!updated.password_hash);
    }

    console.log('\n🎉 Admin credentials:');
    console.log('📧 Email: admin@pizzaapp.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixAdminPassword();
