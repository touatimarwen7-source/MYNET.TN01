import { useState, useEffect } from 'react';
import institutionalTheme from '../theme/theme';
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
import { useToast, useAuth } from '../contexts/AppContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { authSchemas } from '../utils/validationSchemas';
import { authAPI } from '../api';
import TokenManager from '../services/tokenManager';
import { setPageTitle } from '../utils/pageTitle';

export default function Login() {
  const theme = institutionalTheme;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');

  const form = useFormValidation({ email: '', password: '' }, authSchemas.login, async (values) => {
    setApiError('');

    try {
      const response = await authAPI.login(values);
      const data = response.data;

      if (!data?.accessToken || !data?.user) {
        throw new Error('Réponse invalide du serveur');
      }

      // Store tokens
      localStorage.setItem('token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      // Store user data
      const userData = {
        ...data.user,
        userId: data.user.id || data.user.userId
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // Login to context
      login(userData);
      addToast('Connexion réussie', 'success');

      // Navigate
      const role = userData.role?.toLowerCase();
      if (role === 'super_admin' || role === 'admin') {
        navigate('/super-admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

    } catch (error) {
      console.error('❌ Login error:', error);
      let errorMessage = 'Email ou mot de passe incorrect';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        // Timeout error
        errorMessage = 'Le serveur met trop de temps à répondre. Veuillez réessayer dans quelques instants.';
      } else if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
      } else {
        // Other errors
        errorMessage = error.message || errorMessage;
      }
      
      setApiError(errorMessage);
      addToast(errorMessage, 'error');
    }
  });

  useEffect(() => {
    setPageTitle('Connexion Sécurisée');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple submissions
    if (form.isSubmitting) {
      console.warn('⚠️ Form already submitting, ignoring duplicate request');
      return;
    }

    await form.handleSubmit(e);
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
                color: institutionalTheme.palette.primary.main,
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              Connexion Sécurisée
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <Link
                href="/password-reset"
                sx={{
                  fontSize: '13px',
                  color: institutionalTheme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Mot de passe oublié?
              </Link>
              <Link
                href="/register"
                sx={{
                  fontSize: '13px',
                  color: institutionalTheme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Créer un compte
              </Link>
            </Box>

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

            {apiError && (
              <Alert severity="error" sx={{ marginBottom: '24px' }}>
                {apiError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                {...form.getFieldProps('email')}
                placeholder="Entrez votre adresse e-mail"
                variant="outlined"
                disabled={form.isSubmitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-error fieldset': {
                      borderColor: '#d32f2f',
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                {...form.getFieldProps('password')}
                placeholder="Entrez votre mot de passe"
                variant="outlined"
                disabled={form.isSubmitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-error fieldset': {
                      borderColor: '#d32f2f',
                    },
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={form.isSubmitting || !form.isDirty}
                sx={{
                  minHeight: '44px',
                  backgroundColor: institutionalTheme.palette.primary.main,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '16px',
                  '&:hover': { backgroundColor: '#0d47a1' },
                  '&:disabled': { backgroundColor: '#e0e0e0' },
                }}
              >
                {form.isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CircularProgress
                      size={20}
                      sx={{ color: institutionalTheme.palette.primary.main }}
                    />
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
                  color: institutionalTheme.palette.primary.main,
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