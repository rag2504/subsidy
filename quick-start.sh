#!/bin/bash

echo "🚀 Quick Start: Blockchain Integration Setup"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup contracts
echo "🏗️ Setting up smart contracts..."
cd contracts
npm install

echo "🔨 Compiling contracts..."
npx hardhat compile

echo "🌐 Starting local blockchain..."
echo "   Keep this terminal open and run the following in a new terminal:"
echo "   cd contracts && npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "   Then copy the contract address and update server/.env"
echo ""

# Start hardhat node in background
npx hardhat node &
HARDHAT_PID=$!

echo "⏳ Waiting for blockchain to start..."
sleep 5

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. In a new terminal, run: cd contracts && npx hardhat run scripts/deploy.js --network localhost"
echo "2. Copy the contract address from the output"
echo "3. Copy server/env.example to server/.env and update the contract address"
echo "4. Copy private keys from the hardhat node output"
echo "5. Start the server: cd server && npm run dev"
echo "6. Start the client: cd client && npm run dev"
echo ""
echo "🔗 Hardhat node is running on http://127.0.0.1:8545"
echo "📖 See setup-blockchain.md for detailed instructions"
echo ""
echo "Press Ctrl+C to stop the blockchain node"

# Wait for user to stop
trap "echo '🛑 Stopping blockchain...'; kill $HARDHAT_PID; exit" INT
wait
