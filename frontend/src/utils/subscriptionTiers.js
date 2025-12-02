/**
 * Subscription Tiers Configuration
 * Définit les services disponibles selon chaque forfait
 */

export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Gratuit',
    description: 'Pour débuter avec MyNet.tn',
    price: 0,
    features: {
      dashboard: true,
      browsetenders: true,
      myoffers: true,
      notifications: true,
      profile: true,
      catalog: false,
      analytics: false,
      erpintegration: false,
      advancedsearch: false,
      automationtemplates: false,
      customreports: false,
      dedicatedsupport: false,
    },
  },
  STARTER: {
    id: 'starter',
    name: 'Démarrage',
    description: 'Pour les petits fournisseurs',
    price: 99,
    features: {
      dashboard: true,
      browsetenders: true,
      myoffers: true,
      notifications: true,
      profile: true,
      catalog: true,
      analytics: false,
      erpintegration: false,
      advancedsearch: true,
      automationtemplates: false,
      customreports: false,
      dedicatedsupport: false,
    },
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professionnel',
    description: 'Pour les fournisseurs actifs',
    price: 299,
    features: {
      dashboard: true,
      browsetenders: true,
      myoffers: true,
      notifications: true,
      profile: true,
      catalog: true,
      analytics: true,
      erpintegration: false,
      advancedsearch: true,
      automationtemplates: true,
      customreports: false,
      dedicatedsupport: true,
    },
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Entreprise',
    description: 'Solution complète',
    price: 999,
    features: {
      dashboard: true,
      browsetenders: true,
      myoffers: true,
      notifications: true,
      profile: true,
      catalog: true,
      analytics: true,
      erpintegration: true,
      advancedsearch: true,
      automationtemplates: true,
      customreports: true,
      dedicatedsupport: true,
    },
  },
};

// Services avec leurs descriptions
export const SERVICE_DESCRIPTIONS = {
  dashboard: {
    label: 'Tableau de Bord',
    icon: '📊',
    description: 'Accédez à un tableau de bord complet avec toutes vos statistiques',
  },
  browsetenders: {
    label: 'Parcourir les Appels',
    icon: '📋',
    description: "Explorez tous les appels d'offres disponibles",
  },
  myoffers: {
    label: 'Mes Offres',
    icon: '💼',
    description: 'Gérez et suivez toutes vos offres soumises',
  },
  notifications: {
    label: 'Notifications',
    icon: '🔔',
    description: 'Recevez des alertes en temps réel',
  },
  profile: {
    label: 'Profil',
    icon: '👤',
    description: 'Gérez votre profil et vos paramètres',
  },
  catalog: {
    label: 'Catalogue',
    icon: '📦',
    description: 'Créez et gérez votre catalogue de produits/services',
  },
  analytics: {
    label: 'Analytiques Avancées',
    icon: '📈',
    description: 'Analysez vos performances avec des graphiques détaillés',
  },
  erpintegration: {
    label: 'Intégration ERP',
    icon: '🔗',
    description: 'Connectez votre système ERP pour une synchronisation automatique',
  },
  advancedsearch: {
    label: 'Recherche Avancée',
    icon: '🔍',
    description: "Filtrez les appels d'offres avec des critères personnalisés",
  },
  automationtemplates: {
    label: "Modèles d'Automation",
    icon: '⚙️',
    description: "Automatisez la soumission d'offres avec des modèles",
  },
  customreports: {
    label: 'Rapports Personnalisés',
    icon: '📊',
    description: 'Générez des rapports détaillés selon vos besoins',
  },
  dedicatedsupport: {
    label: 'Support Dédié',
    icon: '💬',
    description: 'Accédez à un support client prioritaire 24/7',
  },
};

// Valeur de mise à niveau pour chaque forfait
export const UPGRADE_VALUES = {
  free: {
    nextTier: 'starter',
    benefit1: 'Accès au catalogue complet',
    benefit2: 'Recherche avancée des appels',
    benefit3: 'Support prioritaire',
  },
  starter: {
    nextTier: 'professional',
    benefit1: 'Analytiques détaillées',
    benefit2: 'Automation et templates',
    benefit3: 'Support dédié 24/7',
  },
  professional: {
    nextTier: 'enterprise',
    benefit1: 'Intégration ERP complète',
    benefit2: 'Rapports illimités',
    benefit3: 'Account Manager personnel',
  },
};

export const getCurrentTier = (userSubscription) => {
  const tier = userSubscription?.tier || 'free';
  return SUBSCRIPTION_TIERS[tier.toUpperCase()] || SUBSCRIPTION_TIERS.FREE;
};

export const isFeatureAvailable = (userSubscription, featureKey) => {
  const tier = getCurrentTier(userSubscription);
  return tier.features[featureKey] === true;
};

export const getNextTierInfo = (currentTierId) => {
  const tierKey = currentTierId.toUpperCase();
  const tiers = Object.keys(SUBSCRIPTION_TIERS);
  const currentIndex = tiers.indexOf(tierKey);

  if (currentIndex === -1 || currentIndex === tiers.length - 1) {
    return null; // Déjà au tier maximum
  }

  const nextTierId = tiers[currentIndex + 1];
  return SUBSCRIPTION_TIERS[nextTierId];
};
