#!/bin/bash
set -e

echo "=== Building Server Only ==="
echo "Current directory: $(pwd)"

# Change to server directory
cd server

echo "Installing server dependencies..."
npm install

echo "Building server..."
vite build --config vite.config.ts

echo "=== Server Build Complete ==="
ls -la dist/server/
