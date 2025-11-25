import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function StepDocuments({ formData, setFormData, loading }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files || []);
    setFormData((prev) => ({
      ...prev,
      specification_documents: [...(prev.specification_documents || []), ...newFiles],
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      specification_documents: (prev.specification_documents || []).filter((_, i) => i !== index),
    }));
  };

  const docs = formData.specification_documents || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Alert severity="info" sx={{ backgroundColor: '#E3F2FD', color: '#0056B3' }}>
        📄 Uploadez le cahier des charges, les spécifications techniques et tout document pertinent
      </Alert>

      {/* Drag & Drop Area */}
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        sx={{
          border: '2px dashed #0056B3',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: dragOver ? '#E3F2FD' : '#F9F9F9',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': { backgroundColor: '#E3F2FD' },
        }}
      >
        <UploadFileIcon sx={{ fontSize: 48, color: '#0056B3', mb: 2 }} />
        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#212121', mb: 1 }}>
          Glissez-déposez vos fichiers ici
        </Typography>
        <Typography sx={{ fontSize: '12px', color: '#999999' }}>
          ou cliquez pour sélectionner
        </Typography>
        <input
          type="file"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          disabled={loading}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <Button
            component="span"
            variant="contained"
            sx={{
              backgroundColor: '#0056B3',
              color: '#fff',
              marginTop: '12px',
              textTransform: 'none',
            }}
            disabled={loading}
          >
            ➕ Sélectionner les fichiers
          </Button>
        </label>
      </Box>

      {/* Files List */}
      {docs.length > 0 && (
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '12px' }}>
            Fichiers uploadés ({docs.length})
          </Typography>
          <Stack spacing={1}>
            {docs.map((file, index) => (
              <Paper
                key={index}
                sx={{
                  p: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#F9F9F9',
                  borderLeft: '4px solid #0056B3',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <FileDownloadIcon sx={{ color: '#0056B3' }} />
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121' }}>
                      {file.name || 'Fichier'}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#999999' }}>
                      {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Taille inconnue'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(index)}
                  disabled={loading}
                >
                  <DeleteIcon sx={{ fontSize: '18px', color: '#d32f2f' }} />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
