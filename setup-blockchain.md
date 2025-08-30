# Blockchain Integration Setup Guide

## 🚨 CRITICAL SECURITY ACTIONS (DO IMMEDIATELY)

### 1. Rotate Exposed Credentials
If you have any `.env` files with real credentials in your repository:

1. **MongoDB**: Change your database password immediately
2. **Gmail**: Revoke the app password and create a new one
3. **Cashfree**: Rotate your API keys
4. **Remove from Git history**:
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
   ```

### 2. Add .env to .gitignore
```bash
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "uploads/" >> .gitignore
```

## 🏗️ Smart Contract Setup

### Step 1: Install Hardhat Dependencies
```bash
cd contracts
npm install
```

### Step 2: Compile Contracts
```bash
npx hardhat compile
```

### Step 3: Start Local Blockchain
```bash
npx hardhat node
# Keep this terminal open - it will show account private keys
```

### Step 4: Deploy Contract
In a new terminal:
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

**Copy the contract address** - you'll need it for the environment variables.

### Step 5: Get Private Keys
From the Hardhat node output, copy:
- **Account #0** private key (for GOV_PRIVATE_KEY)
- **Account #1** private key (for AUDITOR_PRIVATE_KEY)

## 🔧 Server Configuration

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
Copy `server/env.example` to `server/.env` and fill in:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/subsidy

# JWT Authentication
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRES_IN=7d

# Blockchain Configuration
CHAIN_RPC=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x... # from hardhat deploy
GOV_PRIVATE_KEY=0x...  # from hardhat account #0
AUDITOR_PRIVATE_KEY=0x... # from hardhat account #1

# Email Configuration (optional for demo)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=no-reply@subsidy.gov

# Payment Gateway (optional for demo)
CASHFREE_API_URL=https://api.cashfree.com/pg
CASHFREE_APP_ID=your-cashfree-app-id
CASHFREE_SECRET_KEY=your-cashfree-secret-key
```

## 🚀 Running the Application

### Step 1: Start Blockchain (if not already running)
```bash
cd contracts
npx hardhat node
```

### Step 2: Start Server
```bash
cd server
npm run dev
```

### Step 3: Start Client
```bash
cd client
npm run dev
```

## 🧪 Testing the Integration

### Test 1: Government Operations
1. Go to **Gov** tab
2. Login with: `gov@subsidy.gov` / `gov-secure-2024`
3. Create a program
4. Approve a project
5. Define milestones

### Test 2: Producer Operations
1. Go to **Producer** tab
2. Enter your email
3. Complete OTP verification
4. Apply for a project

### Test 3: Auditor Operations
1. Go to **Auditor** tab
2. Login with: `auditor@subsidy.gov` / `audit-secure-2024`
3. Select an approved project
4. Upload evidence file
5. Submit attestation (this will call the smart contract)

### Test 4: Payment Release
1. Go back to **Gov** tab
2. Trigger payment release for attested milestone
3. Check transaction hash in response

## 🔍 Verification

### Check Smart Contract Events
In the Hardhat node terminal, you should see:
- `Attested` events when auditors submit attestations
- `Released` events when payments are released

### Check Transaction Hashes
- All attestations and releases now return transaction hashes
- These can be verified on the blockchain

## 🛡️ Security Features Implemented

### 1. Cryptographic Attestation
- **EIP-712 Typed Data**: Structured, secure signatures
- **File Hashing**: SHA-256 of uploaded evidence files
- **Nonce Protection**: Prevents replay attacks
- **Deadline Enforcement**: Time-limited attestations

### 2. On-Chain Enforcement
- **One-time Payout**: Each milestone can only be released once
- **Amount Caps**: Cannot exceed maximum payout
- **Role-based Access**: Only authorized roles can perform actions
- **Attestation Required**: Payments require prior attestation

### 3. Audit Trail
- **Transaction Hashes**: All operations recorded on blockchain
- **Event Logging**: Complete audit trail in smart contract events
- **MongoDB Records**: Off-chain data with blockchain references

## 🚨 Production Considerations

### 1. Network Selection
- **Testnet**: Use Sepolia or Mumbai for testing
- **Mainnet**: Use Ethereum mainnet for production
- **Private Networks**: Consider private consortium networks

### 2. Gas Optimization
- Batch operations where possible
- Use gas estimation before transactions
- Consider Layer 2 solutions for cost reduction

### 3. Security Hardening
- Multi-signature wallets for government operations
- Time-locks for critical functions
- Emergency pause functionality
- Regular security audits

### 4. Monitoring
- Transaction monitoring
- Event listening for real-time updates
- Error handling and retry mechanisms
- Health checks for blockchain connectivity

## 🔧 Troubleshooting

### Common Issues

1. **"CONTRACT_ADDRESS missing"**
   - Ensure you copied the address from hardhat deploy
   - Check that the address starts with "0x"

2. **"Invalid private key"**
   - Ensure private keys start with "0x"
   - Copy the full private key from hardhat node output

3. **"Network error"**
   - Ensure hardhat node is running
   - Check CHAIN_RPC points to correct endpoint

4. **"File upload failed"**
   - Ensure uploads/ directory exists
   - Check file permissions

### Debug Commands

```bash
# Check contract deployment
npx hardhat console --network localhost
> const contract = await ethers.getContractAt("SubsidyProgram", "CONTRACT_ADDRESS")
> await contract.programs("PROGRAM_ID")

# Check events
npx hardhat console --network localhost
> const contract = await ethers.getContractAt("SubsidyProgram", "CONTRACT_ADDRESS")
> const events = await contract.queryFilter("Attested")
> console.log(events)
```

## 📊 Performance Metrics

### Gas Usage (Estimated)
- `createProgram`: ~50,000 gas
- `approveProject`: ~60,000 gas
- `defineMilestone`: ~80,000 gas
- `attestMilestone`: ~120,000 gas
- `releasePayment`: ~70,000 gas

### Transaction Times
- Local network: < 1 second
- Testnet: 10-30 seconds
- Mainnet: 30-60 seconds

## 🎯 Next Steps

1. **Deploy to Testnet**: Test on Sepolia/Mumbai
2. **Add Frontend Integration**: MetaMask wallet connection
3. **Implement Receipt Generation**: PDF with QR codes
4. **Add Monitoring**: Real-time transaction tracking
5. **Security Audit**: Professional smart contract audit
6. **Production Deployment**: Mainnet deployment with proper security measures
