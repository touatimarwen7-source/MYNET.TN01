import { useState, useEffect } from 'react';
import {
  Box,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Alert,
  Grid,
  TextField,
  CircularProgress
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import WarningIcon from '@mui/icons-material/Warning';
import adminAPI from '../../services/adminAPI';
import { errorHandler } from '../../utils/errorHandler';

/**
 * SystemConfig Component
 * System configuration and settings management
 * @returns {JSX.Element}
 */
export default function SystemConfig() {
  const [config, setConfig] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    twoFactorAuth: false,
    cacheEnabled: true,
    apiRateLimit: 1000
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch config on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  /**
   * Fetch configuration from API
   */
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.config.getAll();
      setConfig(response.data || response);
      setErrorMsg('');
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      // Use defaults if error
      console.warn('Utilisation des paramètres par défaut:', formatted.message);
      setErrorMsg('');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle configuration setting
   */
  const handleToggle = async (key) => {
    const newValue = !config[key];
    try {
      setUpdating(true);
      
      // Special handling for maintenance mode
      if (key === 'maintenanceMode') {
        await adminAPI.config.toggleMaintenance(newValue);
      } else {
        await adminAPI.config.update({ [key]: newValue });
      }

      setConfig({ ...config, [key]: newValue });
      setSuccessMsg(`${key} a été mis à jour`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Clear cache
   */
  const handleCacheClean = async () => {
    try {
      setUpdating(true);
      await adminAPI.config.clearCache();
      setSuccessMsg('Cache nettoyé avec succès');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors du nettoyage du cache');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Restart system
   */
  const handleSystemRestart = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir redémarrer le système?')) return;

    try {
      setUpdating(true);
      await adminAPI.config.restartSystem();
      setSuccessMsg('Redémarrage du système en cours...');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors du redémarrage');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Update API rate limit
   */
  const handleNumberChange = async (key, value) => {
    const newValue = parseInt(value) || 0;
    try {
      setUpdating(true);
      await adminAPI.config.update({ [key]: newValue });
      setConfig({ ...config, [key]: newValue });
      setSuccessMsg('Limite mise à jour');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      const formatted = errorHandler.getUserMessage(error);
      setErrorMsg(formatted.message || 'Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ color: '#0056B3' }} />;
  }

  return (
    <Box>
      {successMsg && <Alert severity="success" sx={{ marginBottom: '16px' }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ marginBottom: '16px' }}>{errorMsg}</Alert>}

      {config.maintenanceMode && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ marginBottom: '16px' }}>
          Mode maintenance activé. Seuls les Super Administrateurs peuvent accéder au système.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #E0E0E0' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '16px' }}>
                Paramètres Opérationnels
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.maintenanceMode}
                      onChange={() => handleToggle('maintenanceMode')}
                      disabled={updating}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0056B3'
                        }
                      }}
                    />
                  }
                  label="Mode Maintenance"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.emailNotifications}
                      onChange={() => handleToggle('emailNotifications')}
                      disabled={updating}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0056B3'
                        }
                      }}
                    />
                  }
                  label="Notifications Email"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.autoBackup}
                      onChange={() => handleToggle('autoBackup')}
                      disabled={updating}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0056B3'
                        }
                      }}
                    />
                  }
                  label="Sauvegarde Automatique"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.twoFactorAuth}
                      onChange={() => handleToggle('twoFactorAuth')}
                      disabled={updating}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0056B3'
                        }
                      }}
                    />
                  }
                  label="Authentification à Deux Facteurs"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.cacheEnabled}
                      onChange={() => handleToggle('cacheEnabled')}
                      disabled={updating}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0056B3'
                        }
                      }}
                    />
                  }
                  label="Cache Activé"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #E0E0E0' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '16px' }}>
                Configuration Avancée
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                    Limite de Requêtes API
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={config.apiRateLimit}
                    onChange={(e) => handleNumberChange('apiRateLimit', e.target.value)}
                    size="small"
                    disabled={updating}
                    inputProps={{ min: 100 }}
                  />
                </Box>

                <Button
                  startIcon={<CachedIcon />}
                  variant="contained"
                  fullWidth
                  onClick={handleCacheClean}
                  disabled={updating}
                  sx={{ backgroundColor: '#0056B3' }}
                >
                  Nettoyer le Cache
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleSystemRestart}
                  disabled={updating}
                  sx={{ color: '#F57C00', borderColor: '#F57C00' }}
                >
                  Redémarrer le Système
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ border: '1px solid #E0E0E0' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '16px' }}>
                Informations du Système
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#616161' }}>Version</Typography>
                    <Typography sx={{ fontWeight: 600 }}>1.2.0</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#616161' }}>Santé du Système</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#2E7D32' }}>99.9%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#616161' }}>Utilisateurs Actifs</Typography>
                    <Typography sx={{ fontWeight: 600 }}>1,254</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#616161' }}>Dernière Sauvegarde</Typography>
                    <Typography sx={{ fontWeight: 600 }}>Aujourd'hui 02:30</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
