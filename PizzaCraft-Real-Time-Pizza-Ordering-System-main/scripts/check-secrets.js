#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return out.split('\n').map(s => s.trim()).filter(Boolean);
  } catch (e) {
    console.error('Failed to get staged files:', e.message);
    process.exit(0); // don't block commits if git not available
  }
}

const patterns = [
  /mongodb\+srv:\/\//i,
  /mongodb:\/\//i,
  /MONGODB_URI/i,
  /JWT_SECRET/i,
  /RAZORPAY|rzp[_-]/i,
  /EMAIL_PASS|EMAIL_USER/i,
  /SUPABASE|SUPABASE_URL|SUPABASE_KEY/i,
  /GOOGLE_API_KEY|AIza[0-9A-Za-z_-]{35}/i,
  /AKIA[0-9A-Z]{16}/i,
  /SECRET[_-]?KEY/i,
  /PRIVATE_KEY/i,
  /-----BEGIN PRIVATE KEY-----/i,
  /API[_-]?KEY/i,
  /ACCESS_TOKEN/i,
  /PASSWORD\s*=/i
];

const staged = getStagedFiles();
if (staged.length === 0) process.exit(0);

let found = false;
for (const file of staged) {
  const lower = file.toLowerCase();
  if (path.basename(lower) === '.env' || lower.includes('.env.')) {
    console.error(`❌ Refusing commit: staged file looks like an env file -> ${file}`);
    found = true;
    continue;
  }

  // Only scan text files and small ones
  try {
    // Use git show to get staged content (works even if file modified later)
    const content = execSync(`git show :"${file}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    for (const re of patterns) {
      if (re.test(content)) {
        console.error(`❌ Potential secret found in ${file} (pattern: ${re})`);
        // show snippet
        const lines = content.split('\n');
        for (let i = 0; i < Math.min(lines.length, 10); i++) {
          if (re.test(lines[i])) console.error(`  -> ${i + 1}: ${lines[i].slice(0, 200)}`);
        }
        found = true;
      }
    }
  } catch (err) {
    // If file is binary or can't be read, skip
  }
}

if (found) {
  console.error('\nCommit aborted. Remove secrets from staged files or move them to .env and add .env to .gitignore.');
  console.error('If this is a false positive, run: git commit --no-verify to bypass (not recommended).');
  process.exit(1);
}

process.exit(0);
