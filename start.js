#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log('🚀 Starting production server...');
  
  // Check if the standalone server exists
  const standalonePath = path.join(__dirname, 'dist/server/standalone.mjs');
  
  if (fs.existsSync(standalonePath)) {
    console.log('✅ Found standalone server, starting...');
    require(standalonePath);
  } else {
    console.log('❌ Standalone server not found, trying production server...');
    const productionPath = path.join(__dirname, 'dist/server/production.mjs');
    
    if (fs.existsSync(productionPath)) {
      require(productionPath);
    } else {
      console.error('❌ No production server found. Please run "npm run build" first.');
      process.exit(1);
    }
  }
} else {
  console.log('🛠️  Starting development server...');
  execSync('vite', { stdio: 'inherit' });
}
