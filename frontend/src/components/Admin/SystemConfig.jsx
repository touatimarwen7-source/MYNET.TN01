import { useState } from 'react';
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
  TextField
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import WarningIcon from '@mui/icons-material/Warning';

export default function SystemConfig() {
  const [config, setConfig] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    twoFactorAuth: false,
    cacheEnabled: true,
    apiRateLimit: 1000
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleToggle = (key) => {
    setConfig({ ...config, [key]: !config[key] });
    setSuccessMsg(`${key} a été mis à jour`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCacheClean = () => {
    setSuccessMsg('Cache nettoyé avec succès');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleNumberChange = (key, value) => {
    setConfig({ ...config, [key]: parseInt(value) || 0 });
  };

  const handleSystemRestart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir redémarrer le système? Les utilisateurs seront temporairement déconnectés.')) {
      setSuccessMsg('Redémarrage du système en cours...');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <Box>
      {successMsg && <Alert severity="success" sx={{ marginBottom: '16px' }}>{successMsg}</Alert>}

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
                    inputProps={{ min: 100 }}
                  />
                </Box>

                <Button
                  startIcon={<CachedIcon />}
                  variant="contained"
                  fullWidth
                  onClick={handleCacheClean}
                  sx={{ backgroundColor: '#0056B3' }}
                >
                  Nettoyer le Cache
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleSystemRestart}
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
