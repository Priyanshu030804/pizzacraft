import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { testConnection } from '../config/database.js';

dotenv.config();

const [,, emailArg, roleArg] = process.argv;

async function run() {
  if (!emailArg) {
    console.log('Usage: node scripts/make-admin.js <email> [role]');
    process.exit(1);
  }
  const role = roleArg || 'admin';
  try {
    const ok = await testConnection();
    if (!ok) console.warn('Warning: DB ping failed, attempting anyway...');

    const user = await User.findOneAndUpdate(
      { email: emailArg.toLowerCase() },
      { $set: { role } },
      { new: true }
    ).lean();

    if (!user) {
      console.log('User not found, creating a new one...');
      const created = await User.create({
        first_name: 'Admin',
        last_name: 'User',
        email: emailArg.toLowerCase(),
        password_hash: '$2a$12$9q5k9q5k9q5k9q5k9q5k9u7af5Nw8D2o5v8m7n9j0k1l2m3n4o5p6', // placeholder, please reset
        role,
        email_verified: true
      });
      console.log(`Created user ${created.email} with role ${role}. Please reset password.`);
    } else {
      console.log(`Updated ${user.email} to role ${role}`);
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
