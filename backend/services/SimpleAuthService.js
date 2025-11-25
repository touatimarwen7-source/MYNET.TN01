const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

class SimpleAuthService {
  constructor() {
    this.usersFile = path.join(__dirname, '../data/users.json');
    this.credentialsMap = {
      'admin@mynet.tn': 'Admin@MyNet.2025',
      'buyer@mynet.tn': 'Buyer@Test.2025',
      'supplier@mynet.tn': 'Supplier@Test.2025'
    };
  }

  loadUsers() {
    try {
      if (fs.existsSync(this.usersFile)) {
        const data = fs.readFileSync(this.usersFile, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
    }
    return [];
  }

  async authenticate(email, password) {
    const users = this.loadUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Simple password verification (development only)
    const correctPassword = this.credentialsMap[email];
    if (password !== correctPassword) {
      throw new Error('Invalid credentials');
    }

    const jwtSecret = process.env.JWT_SECRET || 'MyNet.tn_SecureJWT_2025_LuxuryFinTech_Tunisia_Procurement';
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'MyNet.tn_RefreshToken_2025_SuperSecure_LongExpiry';

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }

  getUserById(userId) {
    const users = this.loadUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}

module.exports = new SimpleAuthService();
