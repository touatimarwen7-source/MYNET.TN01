import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { procurementAPI } from '../api';

export default function CreateTender() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    budget_min: '',
    budget_max: '',
    currency: 'TND',
    deadline: '',
    requirements: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await procurementAPI.createTender(formData);
      navigate(`/tender/${response.data.tender.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création de l\'appel d\'offres');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#fafafa', paddingY: '40px' }}>
      <Container maxWidth="md">
        <Card sx={{ border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ padding: '40px' }}>
            <Typography variant="h2" sx={{ fontSize: '28px', fontWeight: 500, color: '#212121', marginBottom: '8px' }}>
              Créer un Appel d'Offres
            </Typography>
            <Typography sx={{ color: '#616161', marginBottom: '32px' }}>
              Remplissez les détails de votre appel d'offres ci-dessous
            </Typography>

            {error && (
              <Alert severity="error" sx={{ marginBottom: '24px' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TextField
                fullWidth
                label="Titre"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre de l'appel d'offres"
                required
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le projet en détail"
                multiline
                rows={4}
                required
                disabled={loading}
              />

              <FormControl fullWidth disabled={loading}>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Catégorie"
                >
                  <MenuItem value="technology">Technologie</MenuItem>
                  <MenuItem value="supplies">Fournitures</MenuItem>
                  <MenuItem value="construction">Construction</MenuItem>
                  <MenuItem value="services">Services</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '16px' }}>
                <TextField
                  label="Budget Minimum"
                  name="budget_min"
                  type="number"
                  value={formData.budget_min}
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  label="Budget Maximum"
                  name="budget_max"
                  type="number"
                  value={formData.budget_max}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>

              <FormControl fullWidth disabled={loading}>
                <InputLabel>Devise</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  label="Devise"
                >
                  <MenuItem value="TND">Dinar Tunisien</MenuItem>
                  <MenuItem value="USD">Dollar Américain</MenuItem>
                  <MenuItem value="EUR">Euro</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Date de Fermeture"
                name="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    flex: 1,
                    backgroundColor: '#1565c0',
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: '44px',
                    '&:hover': { backgroundColor: '#0d47a1' },
                  }}
                >
                  {loading ? 'Création en cours...' : 'Créer l\'Appel d\'Offres'}
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => navigate('/tenders')}
                  disabled={loading}
                  startIcon={<CancelIcon />}
                  sx={{
                    flex: 1,
                    color: '#1565c0',
                    borderColor: '#1565c0',
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: '44px',
                  }}
                >
                  Annuler
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
