import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useToast } from '../contexts/AppContext';
import { authAPI } from '../api';
import TokenManager from '../services/tokenManager';
import { setPageTitle } from '../utils/pageTitle';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPageTitle('Connexion Sécurisée');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      
      if (!response || !response.data) {
        throw new Error('Réponse du serveur invalide');
      }
      
      if (!response.data.accessToken) {
        throw new Error('Pas de token reçu du serveur');
      }
      
      // Store tokens securely (expiresIn in seconds, default 900 = 15 minutes)
      const expiresIn = response.data.expiresIn || 900;
      TokenManager.setAccessToken(response.data.accessToken, expiresIn);
      
      // Store refresh token (handle both refreshToken and refreshTokenId)
      const refreshToken = response.data.refreshToken || response.data.refreshTokenId;
      if (refreshToken) {
        TokenManager.setRefreshTokenId(refreshToken);
      }
      
      // Extract user data directly from response
      const userData = response.data.user;
      
      // Store user data in TokenManager for persistence across navigation
      TokenManager.setUserData(userData);
      
      addToast('Connexion réussie', 'success', 2000);
      
      // Dispatch event with user data for immediate update
      window.dispatchEvent(new CustomEvent('authChanged', { detail: userData }));
      
      // Navigate to appropriate dashboard based on role
      let redirectPath = '/tenders'; // Default
      if (userData.role === 'admin' || userData.role === 'super_admin') {
        redirectPath = '/admin';
      } else if (userData.role === 'buyer') {
        redirectPath = '/buyer-dashboard';
      } else if (userData.role === 'supplier') {
        redirectPath = '/supplier-search';
      }
      
      navigate(redirectPath, { replace: true });
      
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion. Vérifiez vos identifiants.');
      addToast('Erreur de connexion', 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingY: '60px' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: '8px', boxShadow: 'none' }}>
          <CardContent sx={{ padding: '48px 40px' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: '28px',
                fontWeight: 500,
                color: '#0056B3',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              Connexion Sécurisée
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: '#616161',
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              Connectez-vous à votre compte MyNet.tn
            </Typography>

            {error && (
              <Alert severity="error" sx={{ marginBottom: '24px' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse e-mail"
                required
                variant="outlined"
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
                variant="outlined"
                disabled={loading}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  minHeight: '44px',
                  backgroundColor: '#0056B3',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '16px',
                  '&:hover': { backgroundColor: '#0d47a1' },
                  '&:disabled': { backgroundColor: '#e0e0e0' },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CircularProgress size={20} sx={{ color: '#0056B3' }} />
                    Connexion en cours...
                  </Box>
                ) : (
                  'Se Connecter'
                )}
              </Button>
            </Box>

            <Typography sx={{ marginTop: '24px', textAlign: 'center', color: '#616161' }}>
              Pas encore de compte?{' '}
              <Link
                href="/register"
                sx={{
                  color: '#0056B3',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                S'inscrire
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
