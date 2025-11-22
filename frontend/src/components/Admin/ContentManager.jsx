import { useState } from 'react';
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
  LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ContentManager() {
  const [pages, setPages] = useState([
    { id: 1, title: 'À Propos', slug: 'about', lastModified: '2024-01-20', status: 'published' },
    { id: 2, title: 'Conditions d\'Utilisation', slug: 'terms', lastModified: '2024-01-15', status: 'published' },
    { id: 3, title: 'Politique de Confidentialité', slug: 'privacy', lastModified: '2024-01-10', status: 'published' },
  ]);
  const [files, setFiles] = useState([
    { id: 1, name: 'Guide-Utilisateur.pdf', size: '2.5 MB', uploadedDate: '2024-01-18' },
    { id: 2, name: 'Logo-MyNet.png', size: '450 KB', uploadedDate: '2024-01-15' },
  ]);
  const [openPageDialog, setOpenPageDialog] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [pageContent, setPageContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleEditPage = (page) => {
    setEditingPage(page);
    setPageContent(page.content || '');
    setOpenPageDialog(true);
  };

  const handleSavePage = () => {
    setPages(pages.map(p =>
      p.id === editingPage.id
        ? { ...p, content: pageContent, lastModified: new Date().toISOString().split('T')[0] }
        : p
    ));
    setSuccessMsg(`Page "${editingPage.title}" mise à jour`);
    setOpenPageDialog(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        setFiles([...files, {
          id: Math.max(...files.map(f => f.id), 0) + 1,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedDate: new Date().toISOString().split('T')[0]
        }]);
        setSuccessMsg(`Fichier "${file.name}" téléchargé`);
        setUploading(false);
        setTimeout(() => setSuccessMsg(''), 3000);
      }, 1000);
    }
  };

  return (
    <Box>
      {successMsg && <Alert severity="success" sx={{ marginBottom: '16px' }}>{successMsg}</Alert>}

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
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button
            component="span"
            startIcon={<CloudUploadIcon />}
            variant="contained"
            sx={{ backgroundColor: '#0056B3' }}
          >
            Télécharger un Fichier
          </Button>
        </label>
      </Box>

      {uploading && <LinearProgress sx={{ marginBottom: '16px' }} />}

      <Box sx={{ backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '16px' }}>
        {files.map(file => (
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
            <Button size="small" variant="outlined">
              Télécharger
            </Button>
          </Box>
        ))}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPageDialog(false)}>Annuler</Button>
          <Button onClick={handleSavePage} variant="contained" sx={{ backgroundColor: '#0056B3' }}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
