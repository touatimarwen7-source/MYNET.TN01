import { createContext, useState, useCallback, useContext } from 'react';
import superAdminService from '../services/superAdminService';

const UserAdminContext = createContext();

export const UserAdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminService.users.list(params);
      setUsers(response.data?.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(
    async (id, role) => {
      setLoading(true);
      setError(null);
      try {
        const response = await superAdminService.users.updateRole(id, { role });
        setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
        setSuccess('User role updated successfully');
        setTimeout(() => setSuccess(null), 3000);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [users]
  );

  const blockUser = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await superAdminService.users.block(id);
        setUsers(
          users.map((u) => (u.id === id ? { ...u, is_active: false } : u))
        );
        setSuccess('User blocked successfully');
        setTimeout(() => setSuccess(null), 3000);
        return true;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [users]
  );

  const unblockUser = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await superAdminService.users.unblock(id);
        setUsers(
          users.map((u) => (u.id === id ? { ...u, is_active: true } : u))
        );
        setSuccess('User unblocked successfully');
        setTimeout(() => setSuccess(null), 3000);
        return true;
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [users]
  );

  const value = {
    users,
    loading,
    error,
    success,
    fetchUsers,
    updateUserRole,
    blockUser,
    unblockUser,
  };

  return (
    <UserAdminContext.Provider value={value}>
      {children}
    </UserAdminContext.Provider>
  );
};

export const useUserAdmin = () => {
  const context = useContext(UserAdminContext);
  if (!context)
    throw new Error('useUserAdmin must be used within UserAdminProvider');
  return context;
};
