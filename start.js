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
  
  // Use our simple working server
  const simpleServerPath = path.join(__dirname, 'simple-server.js');
  
  if (fs.existsSync(simpleServerPath)) {
    console.log('✅ Found simple server, starting...');
    const fileUrl = `file://${simpleServerPath.replace(/\\/g, '/')}`;
    await import(fileUrl);
  } else {
    console.error('❌ Simple server not found.');
    process.exit(1);
  }
} else {
  console.log('🛠️  Starting development server...');
  try {
    // Try to run vite with npx to bypass version checks
    execSync('npx --yes vite --force', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Vite failed, using simple server for development...');
    // Fallback: run the simple server in development mode
    const simpleServerPath = path.join(__dirname, 'simple-server.js');
    if (fs.existsSync(simpleServerPath)) {
      console.log('✅ Using simple server for development...');
      const fileUrl = `file://${simpleServerPath.replace(/\\/g, '/')}`;
      await import(fileUrl);
    } else {
      console.error('❌ No server available.');
      process.exit(1);
    }
  }
}
