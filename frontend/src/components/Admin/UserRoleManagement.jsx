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
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditIcon from '@mui/icons-material/Edit';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from '../Pagination';

const ITEMS_PER_PAGE = 10;

export default function UserRoleManagement() {
  const [users, setUsers] = useState([
    { id: 1, email: 'user1@example.com', company: 'Société A', role: 'buyer', status: 'active', joinedDate: '2024-01-15' },
    { id: 2, email: 'user2@example.com', company: 'Société B', role: 'supplier', status: 'active', joinedDate: '2024-02-20' },
    { id: 3, email: 'user3@example.com', company: 'Société C', role: 'buyer', status: 'blocked', joinedDate: '2024-03-10' },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEditRole = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setOpenDialog(true);
  };

  const handleSaveRole = () => {
    setUsers(users.map(u =>
      u.id === editingUser.id ? { ...u, role: selectedRole } : u
    ));
    setSuccessMsg(`Rôle de ${editingUser.email} mis à jour en ${selectedRole}`);
    setOpenDialog(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleBlockUser = (userId) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u
    ));
    setSuccessMsg('Statut utilisateur mis à jour');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleResetPassword = (email) => {
    setSuccessMsg(`Email de réinitialisation envoyé à ${email}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteUser = (email) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${email}?`)) {
      setUsers(users.filter(u => u.email !== email));
      setSuccessMsg(`Utilisateur ${email} supprimé`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <Box>
      {successMsg && <Alert severity="success" sx={{ marginBottom: '16px' }}>{successMsg}</Alert>}

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
          InputProps={{
            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>
          }}
        />
        <Button variant="contained" sx={{ backgroundColor: '#0056B3' }}>
          Ajouter Utilisateur
        </Button>
      </Box>

      {loading ? <LoadingSpinner message="Chargement des utilisateurs..." /> : (
        <>
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
                {paginatedUsers.map(user => (
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
                      <IconButton size="small" onClick={() => handleEditRole(user)} title="Modifier le rôle">
                        <EditIcon sx={{ fontSize: '18px', color: '#0056B3' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleBlockUser(user.id)} title={user.status === 'active' ? 'Bloquer' : 'Débloquer'}>
                        <BlockIcon sx={{ fontSize: '18px', color: '#F57C00' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleResetPassword(user.email)} title="Réinitialiser mot de passe">
                        <LockResetIcon sx={{ fontSize: '18px', color: '#0056B3' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteUser(user.email)} title="Supprimer">
                        <DeleteForeverIcon sx={{ fontSize: '18px', color: '#C62828' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le Rôle de l'Utilisateur</DialogTitle>
        <DialogContent sx={{ paddingY: '24px' }}>
          <Select
            fullWidth
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <MenuItem value="buyer">Acheteur</MenuItem>
            <MenuItem value="supplier">Fournisseur</MenuItem>
            <MenuItem value="admin">Administrateur de Contenu</MenuItem>
            <MenuItem value="super_admin">Super Administrateur</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSaveRole} variant="contained" sx={{ backgroundColor: '#0056B3' }}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
