import { useState, useEffect } from 'react';
import institutionalTheme from '../theme/theme';
import {
  Container,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Avatar,
  Divider,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { authAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';

export default function Profile({ user }) {
  const theme = institutionalTheme;

  useEffect(() => {
    setPageTitle('Mon Profil Professionnel');
  }, []);

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Supplier preferences states
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [serviceLocations, setServiceLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [minimumBudget, setMinimumBudget] = useState(0);
  const [maximumBudget, setMaximumBudget] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.data || response.data.user || response.data;
      setProfile(userData);
      setFormData(userData);

      // Load supplier preferences if supplier or buyer
      if (userData.role === 'supplier') {
        setPreferredCategories(userData.preferred_categories || []);
        setServiceLocations(userData.service_locations || []);
        setMinimumBudget(userData.minimum_budget || 0);
        setMaximumBudget(userData.maximum_budget || 0);
      } else if (userData.role === 'buyer') {
        setPreferredCategories(userData.preferred_categories || []);
        setMinimumBudget(userData.minimum_budget || 0);
        setMaximumBudget(userData.maximum_budget || 0);
      }

      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la récupération du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      const userData = response.data.data || response.data.user || response.data;
      setProfile(userData);
      setEditing(false);
      setSuccess('Profil mis à jour avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  // Supplier preferences handlers
  const addCategory = () => {
    if (newCategory.trim() && !preferredCategories.includes(newCategory.trim())) {
      setPreferredCategories([...preferredCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (index) => {
    setPreferredCategories(preferredCategories.filter((_, i) => i !== index));
  };

  const addLocation = () => {
    if (newLocation.trim() && !serviceLocations.includes(newLocation.trim())) {
      setServiceLocations([...serviceLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const removeLocation = (index) => {
    setServiceLocations(serviceLocations.filter((_, i) => i !== index));
  };

  const saveSupplierPreferences = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (profile.role === 'buyer') {
        await authAPI.updateBuyerPreferences({
          preferred_categories: preferredCategories,
          minimum_budget: minimumBudget,
          maximum_budget: maximumBudget,
        });
      } else if (profile.role === 'supplier') {
        await authAPI.updateSupplierPreferences({
          preferred_categories: preferredCategories,
          service_locations: serviceLocations,
          minimum_budget: minimumBudget,
          maximum_budget: maximumBudget,
        });
      }
      setSuccess('Préférences mises à jour avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour des préférences');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ paddingY: '40px' }}>
        <Alert severity="error">Profil non disponible</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', paddingY: '40px', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ marginBottom: '32px' }}>
          <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '8px' }}>
            Mon Profil Professionnel
          </Typography>
          <Typography sx={{ color: '#616161' }}>
            Gérez vos informations de compte et vos paramètres professionnels
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ marginBottom: '24px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: '24px' }}>{success}</Alert>}

        {/* Profile Header Card */}
        <Card sx={{ marginBottom: '32px', border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ padding: '32px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Avatar
                  sx={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: theme.palette.primary.main,
                    fontSize: '32px',
                    fontWeight: 600,
                  }}
                >
                  {profile.company_name ? profile.company_name.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontSize: '24px', fontWeight: 600, color: theme.palette.text.primary }}>
                    {profile.company_name || profile.email}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <Chip
                      label={profile.role === 'buyer' ? 'Acheteur' : profile.role === 'supplier' ? 'Fournisseur' : 'Administrateur'}
                      sx={{ backgroundColor: theme.palette.primary.main, color: 'white', fontWeight: 600 }}
                    />
                    {profile.is_verified && (
                      <Chip icon={<VerifiedIcon />} label="Vérifié" sx={{ backgroundColor: '#2e7d32', color: 'white', fontWeight: 600 }} />
                    )}
                  </Box>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={editing ? <CancelIcon /> : <EditIcon />}
                onClick={() => setEditing(!editing)}
                sx={{
                  backgroundColor: editing ? '#f57c00' : theme.palette.primary.main,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: editing ? '#e65100' : '#0d47a1' },
                }}
              >
                {editing ? 'Annuler' : 'Modifier'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e0e0e0', marginBottom: '24px' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Informations Générales" />
            {profile.role === 'supplier' && <Tab label="Préférences Fournisseur" />}
            {profile.role === 'buyer' && <Tab label="Préférences Acheteur" />}
          </Tabs>
        </Box>

        {/* Tab 0: General Information */}
        {tabValue === 0 && (
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ padding: '32px' }}>
              {!editing ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <EmailIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase' }}>
                          Email
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '16px', color: theme.palette.text.primary, fontWeight: 500 }}>
                        {profile.email}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <PhoneIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase' }}>
                          Téléphone
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '16px', color: theme.palette.text.primary, fontWeight: 500 }}>
                        {profile.phone || '—'}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <BusinessIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase' }}>
                          Entreprise
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '16px', color: theme.palette.text.primary, fontWeight: 500 }}>
                        {profile.company_name || '—'}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase' }}>
                          Ville
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '16px', color: theme.palette.text.primary, fontWeight: 500 }}>
                        {profile.city || '—'}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#616161', textTransform: 'uppercase' }}>
                          Adresse Complète
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '16px', color: theme.palette.text.primary, fontWeight: 500 }}>
                        {profile.address || '—'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <TextField fullWidth label="Email" name="email" value={formData.email || ''} onChange={handleChange} disabled />
                  <TextField fullWidth label="Nom de l'entreprise" name="company_name" value={formData.company_name || ''} onChange={handleChange} />
                  <TextField fullWidth label="Téléphone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                  <TextField fullWidth label="Ville" name="city" value={formData.city || ''} onChange={handleChange} />
                  <TextField fullWidth label="Code Postal" name="postal_code" value={formData.postal_code || ''} onChange={handleChange} />
                  <TextField fullWidth label="Pays" name="country" value={formData.country || ''} onChange={handleChange} />
                  <TextField fullWidth label="Adresse" name="address" multiline rows={3} value={formData.address || ''} onChange={handleChange} />
                  <TextField fullWidth label="Matricule Fiscal" name="tax_id" value={formData.tax_id || ''} onChange={handleChange} />

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      backgroundColor: '#2e7d32',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#1b5e20' },
                    }}
                  >
                    Enregistrer
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 1: Buyer Preferences */}
        {tabValue === 1 && profile.role === 'buyer' && (
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ padding: '32px' }}>
              <Typography variant="h4" sx={{ fontSize: '20px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '24px' }}>
                Préférences d'Acheteur
              </Typography>

              <Divider sx={{ marginBottom: '24px' }} />

              {/* Buyer Statistics */}
              <Box sx={{ marginBottom: '32px' }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '16px' }}>
                  Statistiques
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ padding: '16px', backgroundColor: '#e3f2fd', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '32px', fontWeight: 700, color: theme.palette.primary.main }}>
                        0
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#616161' }}>
                        Appels d'Offres Actifs
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ padding: '16px', backgroundColor: '#fff3e0', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#f57c00' }}>
                        0 DT
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#616161' }}>
                        Budget Total
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ padding: '16px', backgroundColor: '#e8f5e9', textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#2e7d32' }}>
                        0
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: '#616161' }}>
                        Fournisseurs Actifs
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ marginBottom: '24px' }} />

              {/* Preferred Categories */}
              <Box sx={{ marginBottom: '32px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <CategoryIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: theme.palette.text.primary }}>
                    Catégories d'Achat Préférées
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {preferredCategories.length === 0 ? (
                    <Typography sx={{ color: '#999', fontStyle: 'italic' }}>Aucune catégorie définie</Typography>
                  ) : (
                    preferredCategories.map((category, idx) => (
                      <Chip
                        key={idx}
                        label={category}
                        onDelete={() => removeCategory(idx)}
                        sx={{ backgroundColor: '#e3f2fd', color: theme.palette.primary.main }}
                      />
                    ))
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <TextField
                    size="small"
                    placeholder="Ajouter une catégorie..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={addCategory}
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: theme.palette.primary.main, textTransform: 'none', fontWeight: 600, minWidth: '120px' }}
                  >
                    Ajouter
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ marginBottom: '24px' }} />

              {/* Budget Range */}
              <Box sx={{ marginBottom: '24px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: theme.palette.text.primary }}>
                    Plage de Budget Typique
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="number"
                      size="small"
                      label="Budget Minimum"
                      placeholder="0"
                      value={minimumBudget}
                      onChange={(e) => setMinimumBudget(parseFloat(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0 } }}
                      fullWidth
                      helperText="Montant minimum"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="number"
                      size="small"
                      label="Budget Maximum"
                      placeholder="0"
                      value={maximumBudget}
                      onChange={(e) => setMaximumBudget(parseFloat(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0 } }}
                      fullWidth
                      helperText="Montant maximum"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="contained"
                onClick={saveSupplierPreferences}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  backgroundColor: '#2e7d32',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#1b5e20' },
                  width: '100%',
                }}
              >
                Enregistrer les Préférences
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Supplier Preferences */}
        {tabValue === 2 && profile.role === 'supplier' && (
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ padding: '32px' }}>
              <Typography variant="h4" sx={{ fontSize: '20px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '24px' }}>
                Préférences de Fournisseur
              </Typography>

              <Divider sx={{ marginBottom: '24px' }} />

              {/* Preferred Categories */}
              <Box sx={{ marginBottom: '32px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <CategoryIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: theme.palette.text.primary }}>
                    Catégories Préférées
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {preferredCategories.length === 0 ? (
                    <Typography sx={{ color: '#999', fontStyle: 'italic' }}>Aucune catégorie définie</Typography>
                  ) : (
                    preferredCategories.map((category, idx) => (
                      <Chip
                        key={idx}
                        label={category}
                        onDelete={() => removeCategory(idx)}
                        sx={{ backgroundColor: '#e3f2fd', color: theme.palette.primary.main }}
                      />
                    ))
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <TextField
                    size="small"
                    placeholder="Ajouter une catégorie..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={addCategory}
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: theme.palette.primary.main, textTransform: 'none', fontWeight: 600, minWidth: '120px' }}
                  >
                    Ajouter
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ marginBottom: '24px' }} />

              {/* Service Locations */}
              <Box sx={{ marginBottom: '32px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: theme.palette.text.primary }}>
                    Zones de Service
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {serviceLocations.length === 0 ? (
                    <Typography sx={{ color: '#999', fontStyle: 'italic' }}>Aucune zone définie</Typography>
                  ) : (
                    serviceLocations.map((location, idx) => (
                      <Chip
                        key={idx}
                        label={location}
                        onDelete={() => removeLocation(idx)}
                        sx={{ backgroundColor: '#fff3e0', color: '#f57c00' }}
                      />
                    ))
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <TextField
                    size="small"
                    placeholder="Ajouter une zone..."
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={addLocation}
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: '#f57c00', textTransform: 'none', fontWeight: 600, minWidth: '120px' }}
                  >
                    Ajouter
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ marginBottom: '24px' }} />

              {/* Budget Range */}
              <Box sx={{ marginBottom: '24px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: theme.palette.text.primary }}>
                    Fourchette de Budget
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="number"
                      size="small"
                      label="Budget Minimum"
                      placeholder="0"
                      value={minimumBudget}
                      onChange={(e) => setMinimumBudget(parseFloat(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0 } }}
                      fullWidth
                      helperText="Montant minimum souhaité"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="number"
                      size="small"
                      label="Budget Maximum"
                      placeholder="0"
                      value={maximumBudget}
                      onChange={(e) => setMaximumBudget(parseFloat(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0 } }}
                      fullWidth
                      helperText="Montant maximum gérable"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="contained"
                onClick={saveSupplierPreferences}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  backgroundColor: '#2e7d32',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#1b5e20' },
                  width: '100%',
                }}
              >
                Enregistrer les Préférences
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}