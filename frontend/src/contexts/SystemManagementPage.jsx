import React, { useEffect } from 'react';
import { useSystemAdmin } from '../../contexts/SystemAdminContext';
import { useToastContext } from '../../contexts/ToastContext';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';

const SystemManagementPage = () => {
  const { backups, loading, fetchBackups, createBackup } = useSystemAdmin();
  const { addToast } = useToastContext();

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreateBackup = async () => {
    addToast('⏳ Création de la sauvegarde en cours...', 'info');
    const result = await createBackup();
    if (result) {
      addToast('✅ Sauvegarde créée avec succès!', 'success');
    } else {
      addToast('❌ Erreur lors de la création de la sauvegarde.', 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Gestion du Système
      </Typography>

      {/* Backup Section */}
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Sauvegarde & Restauration</Typography>
            <Button
              variant="contained"
              startIcon={<BackupIcon />}
              onClick={handleCreateBackup}
              disabled={loading}
            >
              Créer une Sauvegarde
            </Button>
          </Stack>

          {loading && backups.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom du Fichier</TableCell>
                  <TableCell>Date de Création</TableCell>
                  <TableCell>Taille</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>{backup.filename}</TableCell>
                    <TableCell>
                      {new Date(backup.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{backup.size_mb} MB</TableCell>
                    <TableCell>
                      {/* Restore and Download buttons here */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Audit Log Section (to be implemented) */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6">Journaux d'Audit</Typography>
          {/* Table for audit logs will go here */}
        </CardContent>
      </Card>
    </Container>
  );
};

export default SystemManagementPage;
