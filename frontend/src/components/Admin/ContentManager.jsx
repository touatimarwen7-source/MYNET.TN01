import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import adminAPI from '../../services/adminAPI';
import { errorHandler } from '../../utils/errorHandler';

/**
 * ContentManager Component
 * Manage static pages and file uploads
 * @returns {JSX.Element}
 */
export default function ContentManager() {
  const [pages, setPages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPageDialog, setOpenPageDialog] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [pageContent, setPageContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetch pages and files
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagesRes, filesRes] = await Promise.all([
        adminAPI.content.getPages(),
        adminAPI.content.getFiles()
      ]);
      setPages(pagesRes.data || pagesRes);
      setFiles(filesRes.data || filesRes);
      setErrorMsg('');
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open edit dialog for page
   */
  const handleEditPage = (page) => {
    setEditingPage(page);
    setPageContent(page.content || '');
    setOpenPageDialog(true);
  };

  /**
   * Save page content via API
   */
  const handleSavePage = async () => {
    if (!editingPage) return;

    try {
      setSaving(true);
      await adminAPI.content.updatePage(editingPage.id, pageContent);
      setPages(pages.map(p =>
        p.id === editingPage.id
          ? { ...p, content: pageContent, lastModified: new Date().toISOString().split('T')[0] }
          : p
      ));
      setSuccessMsg(`Page "${editingPage.title}" mise à jour`);
      setOpenPageDialog(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await adminAPI.content.uploadFile(file);
      setFiles([...files, response.data || {
        id: Math.max(...files.map(f => f.id || 0), 0) + 1,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedDate: new Date().toISOString().split('T')[0]
      }]);
      setSuccessMsg(`Fichier "${file.name}" téléchargé`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors du téléchargement');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  /**
   * Delete file via API
   */
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Êtes-vous sûr?')) return;

    try {
      await adminAPI.content.deleteFile(fileId);
      setFiles(files.filter(f => f.id !== fileId));
      setSuccessMsg('Fichier supprimé');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <CircularProgress sx={{ color: '#0056B3' }} />;
  }

  return (
    <Box>
      {successMsg && <Alert severity="success" sx={{ marginBottom: '16px' }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ marginBottom: '16px' }}>{errorMsg}</Alert>}

      <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 600 }}>
        Gestion des Pages
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: '32px' }}>
        {pages.map(page => (
          <Grid item xs={12} sm={6} md={4} key={page.id}>
            <Card sx={{ border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '8px' }}>
                  {page.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#616161', display: 'block', marginBottom: '12px' }}>
                  Dernière modification: {page.lastModified}
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => handleEditPage(page)}
                  sx={{ backgroundColor: '#0056B3' }}
                  disabled={saving || uploading}
                >
                  Éditer
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 600 }}>
        Gestion des Fichiers
      </Typography>

      <Box sx={{ marginBottom: '24px' }}>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button
            component="span"
            startIcon={<CloudUploadIcon />}
            variant="contained"
            sx={{ backgroundColor: '#0056B3' }}
            disabled={uploading}
          >
            Télécharger un Fichier
          </Button>
        </label>
      </Box>

      {uploading && <LinearProgress sx={{ marginBottom: '16px' }} />}

      <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '16px' }}>
        {files.length === 0 ? (
          <Typography sx={{ color: '#616161' }}>Aucun fichier</Typography>
        ) : (
          files.map(file => (
            <Box
              key={file.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #E0E0E0',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{file.name}</Typography>
                <Typography variant="caption" sx={{ color: '#616161' }}>
                  {file.size} • {file.uploadedDate}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteFile(file.id)}
                disabled={uploading || saving}
                sx={{ color: '#C62828', borderColor: '#C62828' }}
              >
                Supprimer
              </Button>
            </Box>
          ))
        )}
      </Box>

      <Dialog open={openPageDialog} onClose={() => setOpenPageDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Éditer: {editingPage?.title}</DialogTitle>
        <DialogContent sx={{ paddingY: '24px' }}>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
            placeholder="Entrez le contenu de la page..."
            variant="outlined"
            disabled={saving}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPageDialog(false)} disabled={saving}>Annuler</Button>
          <Button
            onClick={handleSavePage}
            variant="contained"
            sx={{ backgroundColor: '#0056B3' }}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} sx={{ color: '#FFF' }} /> : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
