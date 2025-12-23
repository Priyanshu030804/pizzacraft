import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// Get token from command line argument
const token = process.argv[2];

if (!token) {
  console.log('❌ Please provide a JWT token as argument');
  console.log('Usage: node decode-token.js <your-jwt-token>');
  process.exit(1);
}

try {
  const decoded = jwt.decode(token);
  console.log('\n📝 Decoded JWT token (without verification):');
  console.log(JSON.stringify(decoded, null, 2));
  
  console.log('\n🔐 Verifying token...');
  const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
  console.log('✅ Token is valid');
  console.log('User ID:', verified.userId);
  console.log('Email:', verified.email);
  console.log('Role:', verified.role);
  
} catch (error) {
  console.error('❌ Token verification failed:', error.message);
}

process.exit(0);
