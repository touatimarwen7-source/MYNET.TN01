import { createContext, useContext, useState } from 'react';

export const SuperAdminContext = createContext();

export const SuperAdminProvider = ({ children }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [superAdminData, setSuperAdminData] = useState(null);

  const value = {
    isSuperAdmin,
    setIsSuperAdmin,
    superAdminData,
    setSuperAdminData,
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within SuperAdminProvider');
  }
  return context;
};
