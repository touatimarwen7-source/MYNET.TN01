import { useState, useEffect } from 'react';
import axios from 'axios';
import { setPageTitle } from '../utils/pageTitle';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ role: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'buyer', full_name: '' });

  useEffect(() => {
    setPageTitle('Gestion des Utilisateurs');
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams(Object.entries(filter).filter(([_, v]) => v));
      const response = await axios.get(`http://localhost:3000/api/admin/users?${queryParams}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setNewUser({ email: '', password: '', role: 'buyer', full_name: '' });
      setShowModal(false);
      fetchUsers();
      alert('Utilisateur créé avec succès');
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  const handleToggleStatus = async (userId, enabled) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/users/${userId}/status`,
        { enabled },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      fetchUsers();
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      fetchUsers();
      alert('Utilisateur supprimé');
    } catch (error) {
      alert('Erreur: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;

  return (
    <div className="user-management">
      <h1>👥 Gestion des Utilisateurs</h1>

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Ajouter Utilisateur</button>

      <div className="filters-panel">
        <select value={filter.role} onChange={(e) => setFilter({...filter, role: e.target.value})}>
          <option value="">Tous les rôles</option>
          <option value="buyer">Acheteur</option>
          <option value="supplier">Fournisseur</option>
          <option value="admin">Admin</option>
        </select>

        <select value={filter.status} onChange={(e) => setFilter({...filter, status: e.target.value})}>
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>

        <button className="btn btn-primary" onClick={fetchUsers}>Filtrer</button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.full_name || '-'}</td>
                <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                <td>
                  <button
                    className={`btn btn-sm ${user.is_active ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleToggleStatus(user.id, !user.is_active)}
                  >
                    {user.is_active ? '✓ Actif' : '✗ Inactif'}
                  </button>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Créer un Nouvel Utilisateur</h2>
            <form onSubmit={handleCreateUser}>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Nom complet"
                value={newUser.full_name}
                onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
              />
              <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                <option value="buyer">Acheteur</option>
                <option value="supplier">Fournisseur</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="btn btn-primary">Créer</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
