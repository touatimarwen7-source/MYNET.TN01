import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditIcon from '@mui/icons-material/Edit';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from '../Pagination';
import adminAPI from '../../services/adminAPI';
import { errorHandler } from '../../utils/errorHandler';

const ITEMS_PER_PAGE = 10;

/**
 * UserRoleManagement Component
 * Comprehensive user management with CRUD operations and role control
 * @returns {JSX.Element}
 */
export default function UserRoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Fetch users from backend API
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.users.getAll(currentPage, ITEMS_PER_PAGE, search);
      setUsers(response.data || response);
      setErrorMsg('');
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors du chargement des utilisateurs');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch on search or page change
  useEffect(() => {
    if (!loading) {
      fetchUsers();
    }
  }, [search, currentPage]);

  const filteredUsers = Array.isArray(users) ? users.filter(u =>
    (u.email?.toLowerCase().includes(search.toLowerCase())) ||
    (u.company?.toLowerCase().includes(search.toLowerCase()))
  ) : [];

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  /**
   * Open dialog for role editing
   */
  const handleEditRole = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setOpenDialog(true);
  };

  /**
   * Save user role via API
   */
  const handleSaveRole = async () => {
    if (!editingUser || !selectedRole) return;

    try {
      setUpdating(true);
      await adminAPI.users.updateRole(editingUser.id, selectedRole);
      setUsers(users.map(u =>
        u.id === editingUser.id ? { ...u, role: selectedRole } : u
      ));
      setSuccessMsg(`Rôle de ${editingUser.email} mis à jour avec succès`);
      setOpenDialog(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Block or unblock user via API
   */
  const handleBlockUser = async (userId, currentStatus) => {
    try {
      setUpdating(true);
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      await adminAPI.users.toggleBlock(userId, newStatus === 'blocked');
      setUsers(users.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      setSuccessMsg(`Utilisateur ${newStatus === 'blocked' ? 'bloqué' : 'débloqué'}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors de la modification du statut');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Reset user password via API
   */
  const handleResetPassword = async (email) => {
    try {
      setUpdating(true);
      const user = users.find(u => u.email === email);
      if (!user) throw new Error('Utilisateur non trouvé');
      
      await adminAPI.users.resetPassword(user.id);
      setSuccessMsg(`Email de réinitialisation envoyé à ${email}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors de l\'envoi du email');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Delete user via API
   */
  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${email}?`)) return;

    try {
      setUpdating(true);
      await adminAPI.users.delete(userId);
      setUsers(users.filter(u => u.id !== userId));
      setSuccessMsg(`Utilisateur ${email} supprimé`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors de la suppression');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      {successMsg && <Alert severity="success" sx={{ marginBottom: '16px' }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ marginBottom: '16px' }}>{errorMsg}</Alert>}

      <Box sx={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <TextField
          placeholder="Rechercher par email ou société..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          disabled={loading}
          InputProps={{
            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>
          }}
        />
      </Box>

      {loading ? <LoadingSpinner message="Chargement des utilisateurs..." /> : (
        <>
          {filteredUsers.length === 0 ? (
            <Alert severity="info">Aucun utilisateur trouvé</Alert>
          ) : (
            <Paper sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>Société</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>Rôle</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>Date d'adhésion</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#F9F9F9' } }}>
                      <TableCell sx={{ fontSize: '13px' }}>{user.email}</TableCell>
                      <TableCell sx={{ fontSize: '13px' }}>{user.company}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            backgroundColor: user.role === 'buyer' ? '#E3F2FD' : '#F3E5F5',
                            color: user.role === 'buyer' ? '#0056B3' : '#7B1FA2'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status === 'active' ? 'Actif' : 'Bloqué'}
                          size="small"
                          sx={{
                            backgroundColor: user.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                            color: user.status === 'active' ? '#2E7D32' : '#C62828'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px' }}>{user.joinedDate}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditRole(user)}
                            disabled={updating}
                            title="Modifier le rôle"
                          >
                            <EditIcon sx={{ fontSize: '18px', color: '#0056B3' }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleBlockUser(user.id, user.status)}
                            disabled={updating}
                            title={user.status === 'active' ? 'Bloquer' : 'Débloquer'}
                          >
                            <BlockIcon sx={{ fontSize: '18px', color: '#F57C00' }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleResetPassword(user.email)}
                            disabled={updating}
                            title="Réinitialiser mot de passe"
                          >
                            <LockResetIcon sx={{ fontSize: '18px', color: '#0056B3' }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            disabled={updating}
                            title="Supprimer"
                          >
                            <DeleteForeverIcon sx={{ fontSize: '18px', color: '#C62828' }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          {filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le Rôle de l'Utilisateur</DialogTitle>
        <DialogContent sx={{ paddingY: '24px' }}>
          <Select
            fullWidth
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={updating}
          >
            <MenuItem value="buyer">Acheteur</MenuItem>
            <MenuItem value="supplier">Fournisseur</MenuItem>
            <MenuItem value="admin">Administrateur de Contenu</MenuItem>
            <MenuItem value="super_admin">Super Administrateur</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={updating}>Annuler</Button>
          <Button
            onClick={handleSaveRole}
            variant="contained"
            sx={{ backgroundColor: '#0056B3' }}
            disabled={updating}
          >
            {updating ? <CircularProgress size={20} sx={{ color: '#FFF' }} /> : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
