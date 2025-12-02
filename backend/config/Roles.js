const Roles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_ASSISTANT: 'admin_assistant',
  BUYER: 'buyer',
  SUPPLIER: 'supplier',
  ACCOUNTANT: 'accountant',
  VIEWER: 'viewer',
};

const Permissions = {
  // Dashboard & Monitoring
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_AUDIT_LOGS: 'view_audit_logs',

  // User Management
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  BLOCK_USERS: 'block_users',

  // Tender Management
  CREATE_TENDER: 'create_tender',
  VIEW_TENDER: 'view_tender',
  EDIT_TENDER: 'edit_tender',
  DELETE_TENDER: 'delete_tender',
  PUBLISH_TENDER: 'publish_tender',
  CLOSE_TENDER: 'close_tender',

  // Offer Management
  SUBMIT_OFFER: 'submit_offer',
  VIEW_OFFER: 'view_offer',
  APPROVE_OFFER: 'approve_offer',
  REJECT_OFFER: 'reject_offer',
  EVALUATE_OFFER: 'evaluate_offer',

  // Purchase Orders
  CREATE_PURCHASE_ORDER: 'create_purchase_order',
  VIEW_PURCHASE_ORDER: 'view_purchase_order',
  MANAGE_INVOICES: 'manage_invoices',

  // Reports & Data
  VIEW_REPORTS: 'view_reports',
  EXPORT_DATA: 'export_data',

  // System Settings
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_BACKUP: 'manage_backup',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  SEND_NOTIFICATIONS: 'send_notifications',

  // Security
  VIEW_SECURITY: 'view_security',
  MANAGE_SECURITY: 'manage_security',
};

const RolePermissions = {
  [Roles.SUPER_ADMIN]: Object.values(Permissions),
  [Roles.ADMIN_ASSISTANT]: [], // Dynamic permissions set by super_admin
  [Roles.BUYER]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.CREATE_TENDER,
    Permissions.VIEW_TENDER,
    Permissions.EDIT_TENDER,
    Permissions.VIEW_OFFER,
    Permissions.APPROVE_OFFER,
    Permissions.REJECT_OFFER,
    Permissions.CREATE_PURCHASE_ORDER,
    Permissions.VIEW_PURCHASE_ORDER,
    Permissions.VIEW_REPORTS,
  ],
  [Roles.SUPPLIER]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_TENDER,
    Permissions.SUBMIT_OFFER,
    Permissions.VIEW_OFFER,
    Permissions.VIEW_PURCHASE_ORDER,
  ],
  [Roles.ACCOUNTANT]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_TENDER,
    Permissions.VIEW_OFFER,
    Permissions.VIEW_PURCHASE_ORDER,
    Permissions.MANAGE_INVOICES,
    Permissions.VIEW_REPORTS,
  ],
  [Roles.VIEWER]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_TENDER,
    Permissions.VIEW_OFFER,
    Permissions.VIEW_PURCHASE_ORDER,
    Permissions.VIEW_REPORTS,
  ],
};

function hasPermission(userRole, permission, customPermissions = null) {
  // If custom permissions are provided (for admin_assistant), use them
  if (customPermissions && Array.isArray(customPermissions)) {
    return customPermissions.includes(permission);
  }

  const permissions = RolePermissions[userRole] || [];
  return permissions.includes(permission);
}

function hasAnyPermission(userRole, permissions, customPermissions = null) {
  return permissions.some((p) => hasPermission(userRole, p, customPermissions));
}

function hasAllPermissions(userRole, permissions, customPermissions = null) {
  return permissions.every((p) => hasPermission(userRole, p, customPermissions));
}

module.exports = {
  Roles,
  Permissions,
  RolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
};
