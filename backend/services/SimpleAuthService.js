
const fs = require('fs');
const path = require('path');
const KeyManagementService = require('../security/KeyManagementService');

class SimpleAuthService {
  constructor() {
    this.usersFilePath = path.join(__dirname, '../data/users.json');
    this.users = this.loadUsers();
  }

  loadUsers() {
    try {
      if (!fs.existsSync(this.usersFilePath)) {
        // Create default users
        const defaultUsers = [
          {
            id: '1',
            username: 'buyer',
            email: 'buyer@mynet.tn',
            password: 'buyer123',
            full_name: 'Acheteur Test',
            role: 'buyer',
            is_active: true,
            is_verified: true,
          },
          {
            id: '2',
            username: 'supplier',
            email: 'supplier@mynet.tn',
            password: 'supplier123',
            full_name: 'Fournisseur Test',
            role: 'supplier',
            is_active: true,
            is_verified: true,
          },
          {
            id: '3',
            username: 'admin',
            email: 'admin@mynet.tn',
            password: 'admin123',
            full_name: 'Administrateur',
            role: 'admin',
            is_active: true,
            is_verified: true,
          },
        ];
        
        fs.writeFileSync(this.usersFilePath, JSON.stringify(defaultUsers, null, 2));
        return defaultUsers;
      }

      const data = fs.readFileSync(this.usersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  saveUsers() {
    try {
      fs.writeFileSync(this.usersFilePath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  async authenticate(email, password) {
    try {
      const user = this.users.find(u => u.email === email && u.is_active);
      
      if (!user) {
        return null;
      }

      // Simple password comparison (in production, use hashing)
      if (user.password !== password) {
        return null;
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  async register(userData) {
    try {
      // Check if email already exists
      if (this.users.find(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }

      // Check if username already exists
      if (this.users.find(u => u.username === userData.username)) {
        throw new Error('Username already exists');
      }

      // Create new user
      const newUser = {
        id: String(this.users.length + 1),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        role: userData.role || 'supplier',
        company_name: userData.company_name || '',
        company_registration: userData.company_registration || '',
        is_active: true,
        is_verified: false,
        created_at: new Date().toISOString(),
      };

      this.users.push(newUser);
      this.saveUsers();

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new SimpleAuthService();
