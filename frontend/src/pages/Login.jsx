import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../contexts/ToastContext';
import { authAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle('Connexion Sécurisée');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Déclencher un événement personnalisé pour mettre à jour l'authentification
      window.dispatchEvent(new Event('authChanged'));
      
      addToast('Connexion réussie', 'success', 2000);
      
      // Petite pause avant navigation pour s'assurer que l'état est mis à jour
      setTimeout(() => {
        navigate('/tenders');
      }, 100);
    } catch (err) {
      addToast('Erreur de connexion. Vérifiez vos identifiants.', 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="form-container">
        <h1>Connexion Sécurisée</h1>
        <p className="subtitle">Connectez-vous à votre compte MyNet.tn</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre adresse e-mail"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>
        <p className="signup-link">
          Pas encore de compte? <a href="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  );
}
