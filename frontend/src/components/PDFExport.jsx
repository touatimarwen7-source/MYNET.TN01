import React, { useState } from 'react';
import axios from 'axios';
import './PDFExport.css';

const PDFExport = ({ 
  documentType, 
  documentId, 
  supplierId = null, 
  startDate = null,
  endDate = null,
  isDraft = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEndpoint = () => {
    switch(documentType) {
      case 'tender':
        return `/api/documents/pdf/tender/${documentId}`;
      case 'offer':
        return `/api/documents/pdf/offer/${documentId}`;
      case 'award':
        return `/api/documents/pdf/award-certificate/${documentId}/${supplierId}`;
      case 'transactions':
        return `/api/documents/pdf/transactions/${supplierId}?start_date=${startDate}&end_date=${endDate}`;
      default:
        throw new Error('نوع المستند غير معروف');
    }
  };

  const getFileName = () => {
    switch(documentType) {
      case 'tender':
        return `tender_${documentId}.pdf`;
      case 'offer':
        return `offer_${documentId}.pdf`;
      case 'award':
        return `award_${documentId}_${supplierId}.pdf`;
      case 'transactions':
        return `transactions_${supplierId}.pdf`;
      default:
        return 'document.pdf';
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = getEndpoint();
      const response = await axios.get(endpoint, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getFileName();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('فشل تحميل المستند. حاول مرة أخرى.');
      console.error('Error exporting PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = getEndpoint();
      const response = await axios.get(endpoint, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      newWindow.addEventListener('load', () => {
        newWindow.print();
      });
    } catch (err) {
      setError('فشل فتح المستند. حاول مرة أخرى.');
      console.error('Error printing PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-export">
      {loading && <LoadingIndicator />}
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className="btn btn-primary btn-export"
        onClick={handleExportPDF}
        disabled={loading}
        title="تحميل المستند بصيغة PDF"
      >
        <span className="icon">📥</span>
        تصدير PDF
      </button>

      <button 
        className="btn btn-secondary btn-print"
        onClick={handlePrint}
        disabled={loading}
        title="طباعة المستند"
      >
        <span className="icon">🖨️</span>
        طباعة
      </button>
    </div>
  );
};

const LoadingIndicator = () => (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p>جاري تحضير المستند...</p>
  </div>
);

export default PDFExport;
