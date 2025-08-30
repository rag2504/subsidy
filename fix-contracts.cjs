const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Contracts Setup...\n');

// Step 1: Create simple package.json
const packageJson = {
  "name": "gh2-subsidy-contracts",
  "private": true,
  "scripts": {
    "compile": "hardhat compile",
    "node": "hardhat node",
    "deploy": "hardhat run scripts/deploy.js --network localhost"
  },
  "devDependencies": {
    "hardhat": "^2.19.0"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^4.9.6",
    "ethers": "^5.7.2"
  }
};

// Step 2: Create simple hardhat config
const hardhatConfig = `/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
`;

// Step 3: Create contracts directory structure
const contractsDir = path.join(__dirname, 'contracts');
const contractsContractsDir = path.join(contractsDir, 'contracts');
const scriptsDir = path.join(contractsDir, 'scripts');

// Create directories
if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir);
}
if (!fs.existsSync(contractsContractsDir)) {
  fs.mkdirSync(contractsContractsDir);
}
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir);
}

// Write package.json
fs.writeFileSync(
  path.join(contractsDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// Write hardhat config
fs.writeFileSync(
  path.join(contractsDir, 'hardhat.config.js'),
  hardhatConfig
);

console.log('✅ Created contracts/package.json');
console.log('✅ Created contracts/hardhat.config.js');
console.log('✅ Created directory structure');

console.log('\n📋 Next Steps:');
console.log('1. cd contracts');
console.log('2. npm install');
console.log('3. npx hardhat compile');
console.log('4. npx hardhat node (in one terminal)');
console.log('5. npx hardhat run scripts/deploy.js --network localhost (in another terminal)');

console.log('\n🎉 Contracts setup fixed!');
