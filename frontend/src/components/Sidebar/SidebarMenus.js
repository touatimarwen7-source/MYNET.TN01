
/**
 * Sidebar menu definitions for all user roles
 * Organized by role: buyer, supplier, admin, super_admin
 */

import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SecurityIcon from '@mui/icons-material/Security';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderIcon from '@mui/icons-material/Folder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

/**
 * Build admin menu based on permissions
 */
function buildAdminMenu(permissions) {
  const baseMenu = [
    { 
      id: 'dashboard',
      label: 'Tableau de Bord', 
      icon: DashboardIcon, 
      path: '/admin-dashboard' 
    }
  ];

  const permissionMap = {
    manage_users: { 
      id: 'users',
      label: 'Gestion des Utilisateurs', 
      icon: PeopleIcon, 
      path: '/admin/users' 
    },
    view_users: { 
      id: 'view-users',
      label: 'Voir Utilisateurs', 
      icon: PeopleIcon, 
      path: '/admin/users' 
    },
    manage_tenders: { 
      id: 'tenders',
      label: 'Gestion des Appels', 
      icon: GavelIcon, 
      path: '/admin/tenders' 
    },
    view_reports: { 
      id: 'reports',
      label: 'Rapports', 
      icon: AssessmentIcon, 
      path: '/admin/reports' 
    },
    manage_settings: { 
      id: 'settings',
      label: 'Paramètres', 
      icon: SettingsIcon, 
      path: '/admin/settings' 
    },
  };

  if (permissions && Array.isArray(permissions)) {
    permissions.forEach((perm) => {
      if (permissionMap[perm] && !baseMenu.find((m) => m.path === permissionMap[perm].path)) {
        baseMenu.push(permissionMap[perm]);
      }
    });
  } else {
    // Default permissions for admin
    baseMenu.push(
      { id: 'users', label: 'Gestion des Utilisateurs', icon: PeopleIcon, path: '/admin/users' },
      { id: 'reports', label: 'Rapports', icon: AssessmentIcon, path: '/admin/reports' },
      { id: 'settings', label: 'Paramètres', icon: SettingsIcon, path: '/admin/settings' }
    );
  }

  return baseMenu;
}

/**
 * Menu definitions for each role
 */
const buyerMenu = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: DashboardIcon, path: '/buyer-dashboard' },
  { id: 'tenders', label: 'Appels d\'Offres', icon: GavelIcon, path: '/tenders' },
  { id: 'create-tender', label: 'Créer un Appel', icon: GavelIcon, path: '/create-tender' },
  { id: 'offers', label: 'Offres Reçues', icon: LocalOfferIcon, path: '/buyer-active-tenders' },
  { id: 'reports', label: 'Rapports', icon: AssessmentIcon, path: '/financial-reports' },
  { id: 'profile', label: 'Profil', icon: PersonIcon, path: '/profile' },
  { id: 'settings', label: 'Paramètres', icon: SettingsIcon, path: '/settings' },
];

const supplierMenu = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: DashboardIcon, path: '/supplier-dashboard' },
  { id: 'tenders', label: 'Appels Disponibles', icon: GavelIcon, path: '/tenders' },
  { id: 'offers', label: 'Mes Offres', icon: LocalOfferIcon, path: '/my-offers' },
  { id: 'invoices', label: 'Factures', icon: ShoppingCartIcon, path: '/supplier-invoices' },
  { id: 'profile', label: 'Profil', icon: PersonIcon, path: '/profile' },
  { id: 'settings', label: 'Paramètres', icon: SettingsIcon, path: '/settings' },
];

const superAdminMenu = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: DashboardIcon, path: '/super-admin' },
  { id: 'control', label: 'Centre de Contrôle', icon: AdminPanelSettingsIcon, path: '/super-admin' },
  { id: 'users', label: 'Gestion Utilisateurs', icon: PeopleIcon, path: '/super-admin/users' },
  { id: 'roles', label: 'Rôles et Permissions', icon: SecurityIcon, path: '/super-admin/roles' },
  { id: 'assistants', label: 'Assistants Admin', icon: SupervisedUserCircleIcon, path: '/super-admin/assistants' },
  { id: 'analytics', label: 'Analyses Avancées', icon: BarChartIcon, path: '/super-admin/analytics' },
  { id: 'files', label: 'Gestion Fichiers', icon: FolderIcon, path: '/super-admin/files' },
  { id: 'notifications', label: 'Notifications', icon: NotificationsIcon, path: '/super-admin/notifications' },
  { id: 'content', label: 'Gestion Contenu', icon: ArticleIcon, path: '/super-admin/content' },
  { id: 'editor', label: 'Éditeur Pages', icon: CodeIcon, path: '/super-admin/page-editor' },
  { id: 'features', label: 'Contrôle Features', icon: SettingsIcon, path: '/super-admin/features' },
];

const adminMenu = buildAdminMenu(null);

/**
 * Get menu items based on user role
 * @param {string} role - User role (buyer, supplier, admin, super_admin)
 * @param {Array} permissions - Optional admin permissions array
 * @returns {Array} Menu configuration for the role
 */
export function getMenuByRole(role, permissions = null) {
  if (!role || typeof role !== 'string') {
    console.warn('Invalid role provided to getMenuByRole:', role);
    return buyerMenu;
  }

  const normalizedRole = role.toLowerCase().trim();

  switch (normalizedRole) {
    case 'buyer':
      return buyerMenu;
    case 'supplier':
      return supplierMenu;
    case 'admin':
      return permissions ? buildAdminMenu(permissions) : adminMenu;
    case 'super_admin':
    case 'superadmin':
      return superAdminMenu;
    default:
      console.warn('Unknown role, using buyer menu as fallback:', role);
      return buyerMenu;
  }
}

// Export menus for compatibility
export { buyerMenu, supplierMenu, superAdminMenu, adminMenu };
