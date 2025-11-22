import { useState, useCallback } from 'react';

export const useSubscriptionTier = (userSubscription) => {
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureKey: null,
    currentTier: { id: 'enterprise', name: 'Enterprise' }
  });

  // ✅ Toutes les fonctionnalités sont disponibles pour tous
  const checkFeatureAccess = useCallback(() => {
    return true; // Toujours accessible
  }, []);

  const handleLockedFeatureClick = useCallback(() => {
    return false; // Aucune fonction verrouillée
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModal(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  return {
    currentTier: { id: 'enterprise', name: 'Enterprise' },
    checkFeatureAccess,
    handleLockedFeatureClick,
    closeUpgradeModal,
    upgradeModal
  };
};
