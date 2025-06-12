#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building for Netlify deployment...');

// Ensure client/dist directory exists
const distDir = path.join(process.cwd(), 'client', 'dist');
if (!fs.existsSync(path.dirname(distDir))) {
  fs.mkdirSync(path.dirname(distDir), { recursive: true });
}
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

try {
  // Run the build
  execSync('npx vite build --config vite.config.netlify.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('Build completed successfully!');
  
  // Verify build output
  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    console.log('✓ Build artifacts created in client/dist/');
  } else {
    console.error('✗ Build failed - no index.html found');
    process.exit(1);
  }
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}