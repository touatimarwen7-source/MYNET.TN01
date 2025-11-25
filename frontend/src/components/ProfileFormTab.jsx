import { useState } from 'react';
import { THEME_COLORS } from './themeHelpers';
import { Box, Card, CardContent, Grid, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { authAPI } from '../api';

export default function ProfileFormTab({ profile, onUpdate }) {
  const [formData, setFormData] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      onUpdate(response.data.user);
      setSuccess('Les modifications ont été enregistrées avec succès');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ padding: '24px' }}>
        {error && <Alert severity="error" sx={{ marginBottom: '16px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: '16px' }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField fullWidth label="Email" name="email" value={formData.email || ''} onChange={handleChange} disabled />
          <TextField fullWidth label="Nom Complet" name="full_name" value={formData.full_name || ''} onChange={handleChange} />
          <TextField fullWidth label="Téléphone" name="phone" value={formData.phone || ''} onChange={handleChange} />
          <TextField fullWidth label="Entreprise" name="company_name" value={formData.company_name || ''} onChange={handleChange} />
          <TextField fullWidth label="Numéro d'Enregistrement" name="company_registration" value={formData.company_registration || ''} onChange={handleChange} />
          <Button variant="contained" type="submit" disabled={loading} startIcon={<SaveIcon />} sx={{ backgroundColor: '#2e7d32', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#1b5e20' } }}>
            {loading ? <CircularProgress size={20} /> : 'Enregistrer'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
