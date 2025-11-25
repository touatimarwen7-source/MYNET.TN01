#!/usr/bin/env node

const { getPool, initializeDb } = require('../config/db');
const KeyManagementService = require('../security/KeyManagementService');

async function createSuperAdminUser() {
  try {
    
    await initializeDb();
    const pool = getPool();
    
    const adminData = {
      username: 'superadmin',
      email: 'superadmin@mynet.tn',
      password: 'SuperAdmin@123456',
      full_name: 'Super Administrator',
      phone: '+216 20 000 000',
      role: 'super_admin',
      company_name: 'MyNet.tn',
      company_registration: 'ADMIN-001'
    };
    
    // Hash password
    const { hash, salt } = KeyManagementService.hashPassword(adminData.password);
    
    // Check if super admin already exists
    const checkResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [adminData.email]
    );
    
    if (checkResult.rows.length > 0) {
      process.exit(0);
    }
    
    // Insert super admin user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, password_salt, full_name, 
       phone, role, company_name, company_registration, is_verified, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, username, email, role, created_at`,
      [adminData.username, adminData.email, hash, salt, adminData.full_name, 
       adminData.phone, adminData.role, adminData.company_name, adminData.company_registration]
    );
    
    
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

if (require.main === module) {
  createSuperAdminUser();
}

module.exports = { createSuperAdminUser };
