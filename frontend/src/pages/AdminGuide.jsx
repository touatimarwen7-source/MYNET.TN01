import { useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import '../styles/adminGuide.css';

export default function AdminGuide() {
  useEffect(() => {
    setPageTitle('Guide d\'Administration');
  }, []);

  return (
    <div className="admin-guide-page">
      <div className="guide-container">
        <h1>🔐 Guide d'Accès Administrateur</h1>

        <div className="guide-section">
          <h2>Connexion au Compte Administrateur</h2>
          
          <div className="info-box success">
            <h3>✅ Identifiants de Connexion</h3>
            <div className="credential-box">
              <p><strong>Email:</strong> admin@mynet.tn</p>
              <p><strong>Mot de passe:</strong> Voir le fichier .env du backend</p>
              <p><strong>Rôle:</strong> Administrateur</p>
            </div>
          </div>

          <div className="steps">
            <h3>📋 Étapes de Connexion:</h3>
            <ol>
              <li>Rendez-vous sur la page de <a href="/login">Connexion</a></li>
              <li>Entrez l'email: <code>admin@mynet.tn</code></li>
              <li>Entrez votre mot de passe administrateur</li>
              <li>Cliquez sur "Se Connecter"</li>
              <li>Vous serez dirigé vers le <a href="/admin">Tableau de Bord Admin</a></li>
            </ol>
          </div>
        </div>

        <div className="guide-section">
          <h2>Fonctionnalités Administrateur</h2>

          <div className="features-grid">
            <div className="feature-card">
              <h3>📊 Tableau de Bord</h3>
              <p>Vue d'ensemble des statistiques et métriques clés du système</p>
              <a href="/admin" className="btn-small">Accéder →</a>
            </div>

            <div className="feature-card">
              <h3>📋 Logs d'Audit</h3>
              <p>Consulter l'historique complet de toutes les opérations</p>
              <a href="/admin/audit-logs" className="btn-small">Accéder →</a>
            </div>

            <div className="feature-card">
              <h3>❤️ Santé du Système</h3>
              <p>Monitorer les performances et la santé globale</p>
              <a href="/admin/health" className="btn-small">Accéder →</a>
            </div>

            <div className="feature-card">
              <h3>🗂️ Archives</h3>
              <p>Gérer les données archivées et les sauvegardes</p>
              <a href="/admin/archive" className="btn-small">Accéder →</a>
            </div>

            <div className="feature-card">
              <h3>💳 Forfaits d'Abonnement</h3>
              <p>Gérer les plans tarifaires et les niveaux d'accès</p>
              <a href="/admin/tiers" className="btn-small">Accéder →</a>
            </div>

            <div className="feature-card">
              <h3>👥 Gestion des Utilisateurs</h3>
              <p>Créer, modifier ou supprimer des comptes utilisateurs</p>
              <a href="/admin/users" className="btn-small">Accéder →</a>
            </div>
          </div>
        </div>

        <div className="guide-section">
          <h2>Autres Comptes de Test</h2>

          <table className="test-accounts">
            <thead>
              <tr>
                <th>Rôle</th>
                <th>Email</th>
                <th>Mot de Passe</th>
                <th>Accès</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="role-badge admin">Administrateur</span></td>
                <td><code>admin@mynet.tn</code></td>
                <td>Voir .env</td>
                <td><a href="/admin">Tableau de Bord Admin</a></td>
              </tr>
              <tr>
                <td><span className="role-badge buyer">Acheteur</span></td>
                <td><code>buyer@mynet.tn</code></td>
                <td>Voir .env</td>
                <td><a href="/buyer-dashboard">Tableau de Bord Acheteur</a></td>
              </tr>
              <tr>
                <td><span className="role-badge supplier">Fournisseur</span></td>
                <td><code>supplier@mynet.tn</code></td>
                <td>Voir .env</td>
                <td><a href="/supplier-dashboard">Tableau de Bord Fournisseur</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="guide-section">
          <h2>❓ Dépannage</h2>

          <div className="faq">
            <div className="faq-item">
              <h4>Je ne peux pas me connecter</h4>
              <p>✅ Vérifiez que le backend est en cours d'exécution sur le port 3000</p>
              <p>✅ Vérifiez que la base de données PostgreSQL est active</p>
              <p>✅ Vérifiez vos identifiants dans le fichier .env</p>
            </div>

            <div className="faq-item">
              <h4>J'ai oublié mon mot de passe</h4>
              <p>Contactez le support administrateur ou réinitialisez via la base de données</p>
            </div>

            <div className="faq-item">
              <h4>Je n'ai pas accès au Tableau de Bord Admin</h4>
              <p>Assurez-vous que votre compte a le rôle "admin" assigné</p>
            </div>

            <div className="faq-item">
              <h4>Comment obtenir le mot de passe?</h4>
              <p>Consultez le fichier <code>.env</code> du backend ou contactez l'administrateur système</p>
            </div>
          </div>
        </div>

        <div className="guide-footer">
          <p>📚 Documentation: MyNet.tn - Système Professionnel de Marchés Publics</p>
          <p>🇹🇳 Plateforme Tunisienne | 100% Français</p>
        </div>
      </div>
    </div>
  );
}
