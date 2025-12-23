import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
    email_verified: { type: Boolean, default: false },
    verification_token: { type: String, default: null },
    reset_token: { type: String, default: null },
    reset_expires: { type: Date, default: null },
    last_login: { type: Date, default: null }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
