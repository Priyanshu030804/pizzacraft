import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ Auth: No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    console.log('✅ Auth: Token decoded, userId:', decoded.userId);

    const user = await User.findById(decoded.userId).lean();

    if (!user) {
      console.error('❌ Auth: User not found for userId:', decoded.userId);
      return res.status(403).json({ error: 'Invalid token' });
    }

    console.log('✅ Auth: User found:', user.email, 'role:', user.role);
    req.user = {
      ...user,
      id: user._id.toString() // Ensure id field exists
    };
    console.log('✅ Auth: Set req.user with id:', req.user.id, 'role:', req.user.role);
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const requireStaff = (req, res, next) => {
  console.log('🔒 requireStaff check - user role:', req.user?.role, 'full user:', { email: req.user?.email, role: req.user?.role });
  if (!['admin', 'staff'].includes(req.user?.role)) {
    console.log('❌ Access denied - role not admin/staff');
    return res.status(403).json({ error: 'Staff access required' });
  }
  console.log('✅ Staff access granted');
  next();
};