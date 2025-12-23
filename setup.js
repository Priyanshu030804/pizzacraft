#!/usr/bin/env node
/**
 * Quick Setup Script for Pizza Vamsi Platform
 * Run: node setup.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🍕 Pizza Vamsi - Quick Setup\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found!');
  console.log('📝 Copying .env.example to .env...\n');
  
  const examplePath = path.join(__dirname, '.env.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ Created .env file');
    console.log('⚠️  IMPORTANT: Edit .env and add your MongoDB URI and other credentials!\n');
  } else {
    console.log('❌ .env.example not found. Please create .env manually.\n');
  }
} else {
  console.log('✅ .env file exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
console.log('This may take a few minutes...\n');

try {
  console.log('1️⃣  Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n2️⃣  Installing project dependencies...');
  execSync('cd project && npm install', { stdio: 'inherit', shell: true });
  
  console.log('\n3️⃣  Installing admin-dashboard dependencies...');
  execSync('cd admin-dashboard && npm install', { stdio: 'inherit', shell: true });
  
  console.log('\n4️⃣  Installing server dependencies...');
  execSync('cd project/server && npm install', { stdio: 'inherit', shell: true });
  
  console.log('\n✅ All dependencies installed successfully!\n');
  
  console.log('🎉 Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Edit .env file with your MongoDB URI and credentials');
  console.log('2. Run: npm run dev (starts all servers)');
  console.log('3. Open: http://localhost:5173 (main app)');
  console.log('4. Open: http://localhost:5001 (admin dashboard)\n');
  console.log('For deployment: See VERCEL_DEPLOYMENT.md\n');
  
} catch (error) {
  console.error('\n❌ Installation failed:', error.message);
  console.log('\nTry running manually:');
  console.log('  npm run install:all');
  process.exit(1);
}
