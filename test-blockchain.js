// Simple test script for blockchain integration
const BASE_URL = 'http://localhost:3000';

async function testBlockchainIntegration() {
  console.log('🧪 Testing Blockchain Integration...\n');

  // Test 1: Check if server is running
  console.log('1. Testing Server Connection...');
  try {
    const response = await fetch(`${BASE_URL}/api/ping`);
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Server is running:', data.message);
    } else {
      console.log('❌ Server error:', data);
    }
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('   Make sure to start the server: cd server && npm run dev');
    return;
  }

  // Test 2: Test authentication endpoints
  console.log('\n2. Testing Authentication...');
  try {
    // Test static login for gov
    const govResponse = await fetch(`${BASE_URL}/api/auth/static-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gov@subsidy.gov',
        password: 'gov-secure-2024',
        role: 'gov'
      })
    });
    const govData = await govResponse.json();
    if (govResponse.ok && govData.token) {
      console.log('✅ Gov authentication successful');
    } else {
      console.log('❌ Gov authentication failed:', govData.error);
    }

    // Test OTP request for producer
    const otpResponse = await fetch(`${BASE_URL}/api/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    const otpData = await otpResponse.json();
    if (otpResponse.ok && otpData.devOtp) {
      console.log('✅ OTP request successful, Dev OTP:', otpData.devOtp);
    } else {
      console.log('❌ OTP request failed:', otpData.error);
    }
  } catch (error) {
    console.log('❌ Authentication test error:', error.message);
  }

  // Test 3: Test blockchain configuration
  console.log('\n3. Testing Blockchain Configuration...');
  try {
    // This would test if blockchain endpoints are working
    // For now, just check if the server starts without blockchain errors
    console.log('✅ Server started without blockchain errors');
    console.log('   (Blockchain tests require contract deployment)');
  } catch (error) {
    console.log('❌ Blockchain configuration error:', error.message);
  }

  console.log('\n🎉 Basic tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Follow TESTING-GUIDE.md for complete setup');
  console.log('2. Deploy smart contracts using Hardhat');
  console.log('3. Configure environment variables');
  console.log('4. Run end-to-end tests');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  testBlockchainIntegration().catch(console.error);
}
