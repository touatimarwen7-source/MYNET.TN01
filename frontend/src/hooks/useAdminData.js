
import { useState, useEffect, useCallback } from 'react';
import adminAPI from '../services/adminAPI';
import { errorHandler } from '../utils/errorHandler';

/**
 * Hook personnalisé pour gérer les données admin
 * Centralise la logique de chargement et mise en cache
 */
export function useAdminData() {
  const [dashboard, setDashboard] = useState(null);
  const [health, setHealth] = useState(null);
  const [activities, setActivities] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données du dashboard
  const fetchDashboard = useCallback(async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      const formatted = errorHandler.getUserMessage(err);
      setError(formatted.message);
    }
  }, []);

  // Charger la santé du système
  const fetchHealth = useCallback(async () => {
    try {
      const response = await adminAPI.getHealthDashboard();
      setHealth(response.data);
    } catch (err) {
      const formatted = errorHandler.getUserMessage(err);
      setError(formatted.message);
    }
  }, []);

  // Charger les activités récentes
  const fetchActivities = useCallback(async (filters = {}) => {
    try {
      const response = await adminAPI.getRecentActivities(filters);
      setActivities(response.data.activities || []);
    } catch (err) {
      const formatted = errorHandler.getUserMessage(err);
      setError(formatted.message);
    }
  }, []);

  // Charger les stats des assistants
  const fetchAssistants = useCallback(async () => {
    try {
      const response = await adminAPI.getAdminAssistantsStats();
      setAssistants(response.data || []);
    } catch (err) {
      const formatted = errorHandler.getUserMessage(err);
      setError(formatted.message);
    }
  }, []);

  // Charger les métriques de performance
  const fetchPerformance = useCallback(async () => {
    try {
      const response = await adminAPI.getAdminPerformance();
      setPerformance(response.data);
    } catch (err) {
      const formatted = errorHandler.getUserMessage(err);
      setError(formatted.message);
    }
  }, []);

  // Charger toutes les données au montage
  useEffect(() => {
    let mounted = true;

    const loadAllData = async () => {
      if (!mounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        await Promise.allSettled([
          fetchDashboard(),
          fetchHealth(),
          fetchActivities(),
          fetchAssistants(),
          fetchPerformance()
        ]);
      } catch (err) {
        if (mounted) {
          const formatted = errorHandler.getUserMessage(err);
          setError(formatted.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAllData();

    return () => {
      mounted = false;
    };
  }, [fetchDashboard, fetchHealth, fetchActivities, fetchAssistants, fetchPerformance]);

  // Rafraîchir toutes les données
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    await Promise.all([
      fetchDashboard(),
      fetchHealth(),
      fetchActivities(),
      fetchAssistants(),
      fetchPerformance()
    ]);
    
    setLoading(false);
  }, [fetchDashboard, fetchHealth, fetchActivities, fetchAssistants, fetchPerformance]);

  return {
    // Données
    dashboard,
    health,
    activities,
    assistants,
    performance,
    
    // État
    loading,
    error,
    
    // Actions
    refresh,
    fetchDashboard,
    fetchHealth,
    fetchActivities,
    fetchAssistants,
    fetchPerformance
  };
}

export default useAdminData;
