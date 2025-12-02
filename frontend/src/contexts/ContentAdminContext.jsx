import { createContext, useState, useCallback, useContext } from 'react';
import superAdminService from '../services/superAdminService';

const ContentAdminContext = createContext();

export const ContentAdminProvider = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ===== PAGES =====
  const fetchPages = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminService.pages.list(params);
      setPages(response.data?.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePage = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminService.pages.update(id, data);
      setPages((prev) =>
        prev.map((p) => (p.id === id ? response.data.data : p))
      );
      setSuccess('Page updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePage = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await superAdminService.pages.delete(id);
      setPages((prev) => prev.filter((p) => p.id !== id));
      setSuccess('Page deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== FILES =====
  const fetchFiles = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminService.files.list(params);
      setFiles(response.data?.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== DOCUMENTS =====
  const fetchDocuments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await superAdminService.documents.list(params);
      setDocuments(response.data?.data || []);
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
    pages,
    files,
    documents,
    loading,
    error,
    success,

    // Pages
    fetchPages,
    updatePage,
    deletePage,

    // Files
    fetchFiles,

    // Documents
    fetchDocuments,
  };

  return (
    <ContentAdminContext.Provider value={value}>
      {children}
    </ContentAdminContext.Provider>
  );
};

export const useContentAdmin = () => {
  const context = useContext(ContentAdminContext);
  if (!context) {
    throw new Error('useContentAdmin must be used within ContentAdminProvider');
  }
  return context;
};
