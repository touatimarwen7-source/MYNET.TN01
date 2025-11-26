/**
 * Sidebar menu definitions for all user roles
 * Organized by role: buyer, supplier, admin, super_admin
 */

export const buyerMenu = [
  {
    id: 'dashboard',
    label: 'Tableau de Bord',
    path: '/buyer-dashboard',
    featureKey: 'dashboard',
    subItems: []
  },
  {
    id: 'tenders',
    label: 'Appels d\'Offres',
    subItems: [
      { label: 'Actifs', path: '/buyer-active-tenders', featureKey: 'browsetenders' },
      { label: 'Créer un Appel', path: '/create-tender', featureKey: 'createtender' },
      { label: 'Soumissions', path: '/monitoring-submissions', featureKey: 'browsetenders' },
      { label: 'Évaluation', path: '/tender-evaluation', featureKey: 'analytics' },
      { label: 'Attribution', path: '/tender-awarding', featureKey: 'analytics' },
      { label: 'Notifications', path: '/award-notifications', featureKey: 'analytics' }
    ]
  },
  {
    id: 'finances',
    label: 'Finances',
    subItems: [
      { label: 'Factures', path: '/invoices', featureKey: 'invoices' },
      { label: 'Génération', path: '/invoice-generation', featureKey: 'invoices' },
      { label: 'Budgets', path: '/budgets', featureKey: 'budgets' },
      { label: 'Rapports Financiers', path: '/financial-reports', featureKey: 'customreports' }
    ]
  },
  {
    id: 'operations',
    label: 'Opérations',
    subItems: [
      { label: 'Contrats', path: '/contracts', featureKey: 'operations' },
      { label: 'Livraisons', path: '/deliveries', featureKey: 'operations' },
      { label: 'Performance', path: '/performance', featureKey: 'operations' },
      { label: 'Litiges', path: '/disputes', featureKey: 'operations' }
    ]
  },
  {
    id: 'team',
    label: 'Équipe',
    subItems: [
      { label: 'Gestion d\'équipe', path: '/team-management', featureKey: 'teammanagement' },
      { label: 'Permissions', path: '/team-permissions', featureKey: 'teammanagement' },
      { label: 'Rôles', path: '/team-roles', featureKey: 'teammanagement' }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    featureKey: 'notifications',
    subItems: []
  },
  {
    id: 'profile',
    label: 'Profil',
    featureKey: 'profile',
    subItems: [
      { label: 'Paramètres', path: '/profile', featureKey: 'profile' },
      { label: 'Sécurité', path: '/security', featureKey: 'profile' },
      { label: 'Préférences', path: '/preferences', featureKey: 'profile' }
    ]
  }
];

export const supplierMenu = [
  {
    id: 'dashboard',
    label: 'Tableau de Bord',
    path: '/supplier-search',
    featureKey: 'dashboard',
    subItems: []
  },
  {
    id: 'tenders',
    label: 'Appels d\'Offres',
    subItems: [
      { label: 'Parcourir', path: '/tenders', featureKey: 'browsetenders' },
      { label: 'Mes Offres', path: '/my-offers', featureKey: 'myoffers' },
      { label: 'Soumises', path: '/my-offers?status=submitted', featureKey: 'myoffers' },
      { label: 'Évaluées', path: '/my-offers?status=evaluated', featureKey: 'myoffers' }
    ]
  },
  {
    id: 'catalog',
    label: 'Catalogue',
    subItems: [
      { label: 'Gestion Produits', path: '/supplier-products', featureKey: 'catalog' },
      { label: 'Gestion Services', path: '/supplier-services', featureKey: 'catalog' },
      { label: 'Visibilité', path: '/supplier-catalog', featureKey: 'catalog' }
    ]
  },
  {
    id: 'finances',
    label: 'Finances',
    subItems: [
      { label: 'Factures', path: '/supplier-invoices', featureKey: 'invoices' },
      { label: 'Paiements', path: '/supplier-payments', featureKey: 'invoices' },
      { label: 'Rapports', path: '/supplier-reports', featureKey: 'customreports' }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    featureKey: 'notifications',
    subItems: []
  },
  {
    id: 'profile',
    label: 'Profil',
    featureKey: 'profile',
    subItems: [
      { label: 'Paramètres', path: '/profile', featureKey: 'profile' },
      { label: 'Sécurité', path: '/security', featureKey: 'profile' },
      { label: 'Entreprise', path: '/company-info', featureKey: 'profile' }
    ]
  }
];

export const adminMenu = [
  {
    id: 'dashboard',
    label: 'Tableau de Bord',
    path: '/admin',
    subItems: []
  },
  {
    id: 'users',
    label: '👥 Gestion des Utilisateurs et Sécurité',
    subItems: [
      { label: 'Gestion des Utilisateurs', path: '/admin/users' }
    ]
  },
  {
    id: 'analytics',
    label: '📊 Statistiques',
    subItems: [
      { label: 'Afficher les Statistiques', path: '/admin/health' }
    ]
  },
  {
    id: 'profile',
    label: 'Profil',
    subItems: [
      { label: 'Paramètres', path: '/profile' },
      { label: 'Sécurité', path: '/security' }
    ]
  }
];

export const superAdminMenu = [
  {
    id: 'dashboard',
    label: '📊 Centre de Contrôle',
    path: '/super-admin/dashboard',
    subItems: []
  },
  {
    id: 'admin-functions',
    label: 'Fonctions Admin',
    path: '/super-admin-menu',
    subItems: []
  },
  {
    id: 'users',
    label: '👥 Gestion des Utilisateurs et Sécurité',
    subItems: [
      { label: 'Afficher le Tableau de Bord', path: '/super-admin' }
    ]
  },
  {
    id: 'content',
    label: '📄 Gestion du Contenu Dynamique',
    subItems: [
      { label: 'Afficher le Tableau de Bord', path: '/super-admin' }
    ]
  },
  {
    id: 'system',
    label: '⚙️ Paramètres Système',
    subItems: [
      { label: 'Afficher le Tableau de Bord', path: '/super-admin' }
    ]
  },
  {
    id: 'monitoring',
    label: '📊 Surveillance et Analyse',
    subItems: [
      { label: 'Afficher le Tableau de Bord', path: '/super-admin' }
    ]
  },
  {
    id: 'profile',
    label: 'Profil',
    subItems: [
      { label: 'Paramètres', path: '/profile' },
      { label: 'Sécurité', path: '/security' }
    ]
  }
];

export const getMenuForRole = (role) => {
  switch (role) {
    case 'buyer': return buyerMenu;
    case 'supplier': return supplierMenu;
    case 'admin': return adminMenu;
    case 'super_admin': return superAdminMenu;
    default: return [];
  }
};
