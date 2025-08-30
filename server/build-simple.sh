#!/bin/bash
set -e

echo "=== Starting Server-Only Build ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the server
echo "Building server..."
npm run build

echo "=== Server Build Complete ==="
ls -la dist/server/
