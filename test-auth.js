// Simple test script for authentication endpoints
const BASE_URL = 'http://localhost:3000';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  // Test 1: Static Login for Gov
  console.log('1. Testing Gov Static Login...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/static-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gov@subsidy.gov',
        password: 'gov-secure-2024',
        role: 'gov'
      })
    });
    const data = await response.json();
    if (response.ok && data.token) {
      console.log('✅ Gov login successful');
    } else {
      console.log('❌ Gov login failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Gov login error:', error.message);
  }

  // Test 2: OTP Request for Producer
  console.log('\n2. Testing Producer OTP Request...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    const data = await response.json();
    if (response.ok && data.devOtp) {
      console.log('✅ OTP request successful, Dev OTP:', data.devOtp);
    } else {
      console.log('❌ OTP request failed:', data.error);
    }
  } catch (error) {
    console.log('❌ OTP request error:', error.message);
  }

  // Test 3: Restricted Email OTP Request (should fail)
  console.log('\n3. Testing Restricted Email OTP Request...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'gov@subsidy.gov' })
    });
    const data = await response.json();
    if (!response.ok && data.error) {
      console.log('✅ Correctly blocked restricted email OTP request');
    } else {
      console.log('❌ Should have blocked restricted email OTP request');
    }
  } catch (error) {
    console.log('❌ Restricted email test error:', error.message);
  }

  console.log('\n🎉 Authentication tests completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  testAuth().catch(console.error);
}
