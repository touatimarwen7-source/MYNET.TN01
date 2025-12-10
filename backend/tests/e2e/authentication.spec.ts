
import { test, expect } from '@playwright/test';

/**
 * 🧪 E2E Test: Authentication & Authorization
 */

test.describe('Authentication Flow', () => {
  test('User can register, login, and access protected routes', async ({ request }) => {
    const timestamp = Date.now();
    const testUser = {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@mynet.tn`,
      password: 'SecurePass123!',
      full_name: 'Test User',
      role: 'supplier'
    };

    // Register
    const registerResponse = await request.post('/api/auth/register', {
      data: testUser
    });
    expect(registerResponse.ok()).toBeTruthy();

    // Login
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    expect(loginData.accessToken).toBeDefined();

    // Access protected route
    const profileResponse = await request.get('/api/profile', {
      headers: {
        'Authorization': `Bearer ${loginData.accessToken}`
      }
    });
    expect(profileResponse.ok()).toBeTruthy();
  });

  test('Invalid credentials are rejected', async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      }
    });
    expect(loginResponse.status()).toBe(401);
  });
});
