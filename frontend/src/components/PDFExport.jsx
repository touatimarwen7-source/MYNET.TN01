import React, { useState } from 'react';
import { Button, Box, CircularProgress, Alert, Stack } from '@mui/material';
import axiosInstance from '../services/axiosConfig';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

const PDFExport = ({
  documentType,
  documentId,
  supplierId = null,
  startDate = null,
  endDate = null,
  isDraft = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEndpoint = () => {
    switch (documentType) {
      case 'tender':
        return `/api/documents/pdf/tender/${documentId}`;
      case 'offer':
        return `/api/documents/pdf/offer/${documentId}`;
      case 'award':
        return `/api/documents/pdf/award-certificate/${documentId}/${supplierId}`;
      case 'transactions':
        return `/api/documents/pdf/transactions/${supplierId}?start_date=${startDate}&end_date=${endDate}`;
      default:
        throw new Error('Type de document inconnu');
    }
  };

  const getFileName = () => {
    switch (documentType) {
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
      const response = await axiosInstance.get(endpoint, {
        responseType: 'blob',
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
      setError('Échec du chargement du document. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = getEndpoint();
      const response = await axiosInstance.get(endpoint, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      newWindow.addEventListener('load', () => {
        newWindow.print();
      });
    } catch (err) {
      setError("Échec de l'ouverture du document. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      {loading && (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <CircularProgress size={24} sx={{ marginRight: '12px' }} />
          <span>Préparation du document...</span>
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" spacing={1}>
        <Button
          startIcon={<FileDownloadIcon />}
          onClick={handleExportPDF}
          disabled={loading}
          variant="contained"
        >
          Exporter PDF
        </Button>
        <Button
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={loading}
          variant="outlined"
        >
          Imprimer
        </Button>
      </Stack>
    </Stack>
  );
};

export default PDFExport;
