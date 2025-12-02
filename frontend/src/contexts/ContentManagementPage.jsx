import React, { useState, useEffect } from 'react';
import { useContentAdmin } from '../../contexts/ContentAdminContext';
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useToastContext } from '../../contexts/ToastContext';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ContentManagementPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const {
    pages,
    files,
    loading,
    fetchPages,
    fetchFiles,
    updatePage,
    deletePage,
  } = useContentAdmin();
  const { addToast } = useToastContext();

  useEffect(() => {
    if (tabIndex === 0) {
      fetchPages();
    } else if (tabIndex === 1) {
      fetchFiles();
    }
  }, [tabIndex, fetchPages, fetchFiles]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setNewTitle(page.title);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
    setNewTitle('');
  };

  const handleSaveChanges = async () => {
    if (editingPage && newTitle) {
      const result = await updatePage(editingPage.id, { title: newTitle });
      if (result) {
        addToast('✅ Titre de la page mis à jour avec succès', 'success');
        handleCloseModal();
      } else {
        addToast('❌ Erreur lors de la mise à jour du titre', 'error');
        // The modal remains open for the user to retry
      }
    }
  };

  const handleDeletePage = async (pageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      const success = await deletePage(pageId);
      if (success) {
        addToast('🗑️ Page supprimée avec succès', 'success');
      } else {
        addToast('❌ Erreur lors de la suppression de la page', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Gestion de Contenu
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="Pages Statiques" />
              <Tab label="Fichiers & Médias" />
            </Tabs>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && (
            <>
              <TabPanel value={tabIndex} index={0}>
                <Typography variant="h6" gutterBottom>
                  Gestion des Pages
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Titre de la Page</TableCell>
                      <TableCell>Dernière Modification</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell>{page.title}</TableCell>
                        <TableCell>
                          {new Date(page.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEditPage(page)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeletePage(page.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabPanel>

              <TabPanel value={tabIndex} index={1}>
                <Typography variant="h6" gutterBottom>
                  Gestion des Fichiers
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nom du Fichier</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Taille</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{/* File rows here */}</TableBody>
                </Table>
              </TabPanel>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Page Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Modifier le Titre de la Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Nouveau Titre"
            type="text"
            fullWidth
            variant="standard"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Annuler</Button>
          <Button onClick={handleSaveChanges} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContentManagementPage;
