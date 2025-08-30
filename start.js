#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log('🚀 Starting production server...');
  
  // Check if the standalone server exists
  const standalonePath = path.join(__dirname, 'dist/server/standalone.mjs');
  
  if (fs.existsSync(standalonePath)) {
    console.log('✅ Found standalone server, starting...');
    await import(standalonePath);
  } else {
    console.log('❌ Standalone server not found, trying production server...');
    const productionPath = path.join(__dirname, 'dist/server/production.mjs');
    
    if (fs.existsSync(productionPath)) {
      await import(productionPath);
    } else {
      console.error('❌ No production server found. Please run "npm run build" first.');
      process.exit(1);
    }
  }
} else {
  console.log('🛠️  Starting development server...');
  execSync('vite', { stdio: 'inherit' });
}
