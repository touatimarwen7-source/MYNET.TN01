import { createContext, useState, useCallback, useContext } from 'react';
import superAdminService from '../services/superAdminService';

const SystemAdminContext = createContext();

export const SystemAdminProvider = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ===== AUDIT LOGS =====
  const fetchAuditLogs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminService.auditLogs.list(params);
      setAuditLogs(response.data?.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== BACKUP =====
  const fetchBackups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminService.backup.list();
      setBackups(response.data?.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBackup = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminService.backup.create();
      setBackups((prev) => [response.data.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    // State
    auditLogs,
    backups,
    loading,
    error,
    success,

    // Audit Logs
    fetchAuditLogs,

    // Backup
    fetchBackups,
    createBackup,
  };

  return (
    <SystemAdminContext.Provider value={value}>
      {children}
    </SystemAdminContext.Provider>
  );
};

export const useSystemAdmin = () => {
  const context = useContext(SystemAdminContext);
  if (!context) {
    throw new Error('useSystemAdmin must be used within SystemAdminProvider');
  }
  return context;
};
