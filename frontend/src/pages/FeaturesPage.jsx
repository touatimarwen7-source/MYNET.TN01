import { useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';

import '../styles/featurespage.css';

export default function FeaturesPage() {
  setPageTitle('Solutions et Fonctionnalités');

  return (
    <>
      
      <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="hero-content">
          <h1>Solutions et Fonctionnalités</h1>
          <p className="hero-subtitle">Des outils puissants adaptés à votre rôle</p>
        </div>
      </section>

      {/* Solutions pour l'Acheteur */}
      <section className="buyer-solutions">
        <div className="container">
          <h2>Solutions pour l'Acheteur</h2>
          <p className="section-intro">Outils avancés pour optimiser votre processus d'achat</p>

          <div className="solutions-grid">
            {/* AI-Powered Analysis */}
            <div className="solution-card">
              <div className="solution-icon">🤖</div>
              <h3>Analyse d'Offres Améliorée par l'IA</h3>
              <p className="solution-desc">
                Analysez automatiquement les offres reçues avec intelligence artificielle. 
                Scores de conformité, détection d'anomalies, et recommandations intelligentes.
              </p>
              <ul className="features-list">
                <li>Scoring automatique des offres</li>
                <li>Détection des incohérences</li>
                <li>Analyse comparative en temps réel</li>
                <li>Recommandations basées sur l'historique</li>
                <li>Rapports d'analyse détaillés</li>
              </ul>
            </div>

            {/* Partial Award */}
            <div className="solution-card">
              <div className="solution-icon">🎯</div>
              <h3>Attribution Partielle Avancée</h3>
              <p className="solution-desc">
                Divisez vos commandes entre plusieurs fournisseurs selon des critères 
                spécifiques pour optimiser les risques et bénéficier de la meilleure qualité.
              </p>
              <ul className="features-list">
                <li>Attribution multi-fournisseurs</li>
                <li>Règles de partage personnalisées</li>
                <li>Optimisation des quantités</li>
                <li>Gestion des préférences régionales</li>
                <li>Historique complet des attributions</li>
              </ul>
            </div>

            {/* ERP Integration */}
            <div className="solution-card">
              <div className="solution-icon">🔗</div>
              <h3>Intégration ERP Complète</h3>
              <p className="solution-desc">
                Connectez MyNet.tn directement à votre système ERP pour synchronisation 
                automatique des données et élimination des tâches manuelles.
              </p>
              <ul className="features-list">
                <li>Synchronisation bidirectionnelle</li>
                <li>API REST et webhooks</li>
                <li>Import/Export des données</li>
                <li>Support SAP, Oracle, NetSuite</li>
                <li>Flux de travail automatisés</li>
              </ul>
            </div>

            {/* Advanced Analytics */}
            <div className="solution-card">
              <div className="solution-icon">📊</div>
              <h3>Analytics et Tableaux de Bord</h3>
              <p className="solution-desc">
                Visualisez vos données d'approvisionnement avec des tableaux de bord 
                interactifs et des rapports prédictifs pour mieux décider.
              </p>
              <ul className="features-list">
                <li>KPI en temps réel</li>
                <li>Tableaux de bord personnalisés</li>
                <li>Rapports prédictifs</li>
                <li>Tendances du marché</li>
                <li>Export en PDF/Excel</li>
              </ul>
            </div>

            {/* Team Collaboration */}
            <div className="solution-card">
              <div className="solution-icon">👥</div>
              <h3>Collaboration d'Équipe</h3>
              <p className="solution-desc">
                Coordonnez facilement votre équipe d'achat avec chat intégré, 
                annotations et flux de commentaires sur chaque appel d'offres.
              </p>
              <ul className="features-list">
                <li>Chat en temps réel par AO</li>
                <li>Annotations et commentaires</li>
                <li>Flux de travail collaboratif</li>
                <li>Notifications intelligentes</li>
                <li>Historique de discussion complet</li>
              </ul>
            </div>

            {/* Document Management */}
            <div className="solution-card">
              <div className="solution-icon">📁</div>
              <h3>Gestion Documentaire Sécurisée</h3>
              <p className="solution-desc">
                Stockez, versionnez et organisez tous vos documents d'achat 
                avec authentification fine et traçabilité complète.
              </p>
              <ul className="features-list">
                <li>Stockage sécurisé illimité</li>
                <li>Versioning automatique</li>
                <li>Permissions granulaires</li>
                <li>Recherche full-text</li>
                <li>Archivage 7 ans</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions pour le Fournisseur */}
      <section className="supplier-solutions">
        <div className="container">
          <h2>🏭 Solutions pour le Fournisseur</h2>
          <p className="section-intro">Outils pour croître et gérer votre présence commerciale</p>

          <div className="solutions-grid">
            {/* Smart Alerts */}
            <div className="solution-card">
              <div className="solution-icon">🔔</div>
              <h3>Alertes Intelligentes Ciblées</h3>
              <p className="solution-desc">
                Recevez des notifications intelligentes pour les appels d'offres 
                qui correspondent à votre profil et vos domaines d'expertise.
              </p>
              <ul className="features-list">
                <li>Filtrage par catégorie</li>
                <li>Alertes par localisation</li>
                <li>Notifications prioritaires</li>
                <li>Calendrier d'alertes</li>
                <li>Email + SMS + APP</li>
              </ul>
            </div>

            {/* Catalog Management */}
            <div className="solution-card">
              <div className="solution-icon">📦</div>
              <h3>Gestion des Catalogues</h3>
              <p className="solution-desc">
                Créez et gérez facilement vos catalogues produits avec descriptions 
                détaillées, images, prix et stocks en temps réel.
              </p>
              <ul className="features-list">
                <li>Ajout rapide de produits</li>
                <li>Gestion du stock</li>
                <li>Tarifs multi-niveaux</li>
                <li>Variations et options</li>
                <li>Approvisionnement automatique</li>
              </ul>
            </div>

            {/* Easy Bidding */}
            <div className="solution-card">
              <div className="solution-icon">✍️</div>
              <h3>Soumission d'Offre Facilitée</h3>
              <p className="solution-desc">
                Interface intuitive pour soumettre rapidement vos offres chiffrées. 
                Chiffrement sécurisé et protection contre les modifications.
              </p>
              <ul className="features-list">
                <li>Formulaire pré-rempli</li>
                <li>Calculatrices intégrées</li>
                <li>Chiffrement AES-256</li>
                <li>Brouillons auto-sauvegardés</li>
                <li>Pièces jointes sécurisées</li>
              </ul>
            </div>

            {/* Bid Management */}
            <div className="solution-card">
              <div className="solution-icon">📋</div>
              <h3>Gestion des Offres Soumises</h3>
              <p className="solution-desc">
                Suivez toutes vos offres en un seul endroit avec statuts d'évaluation, 
                commentaires des acheteurs et historique complet.
              </p>
              <ul className="features-list">
                <li>Tableau de bord des offres</li>
                <li>Statuts en temps réel</li>
                <li>Commentaires de l'acheteur</li>
                <li>Tendances d'acceptation</li>
                <li>Rapports de performance</li>
              </ul>
            </div>

            {/* Performance Metrics */}
            <div className="solution-card">
              <div className="solution-icon">⭐</div>
              <h3>Métriques de Performance</h3>
              <p className="solution-desc">
                Améliorez votre réputation avec un système de rating transparent 
                basé sur vos performances réelles et retours clients.
              </p>
              <ul className="features-list">
                <li>Rating transparent</li>
                <li>Retours des clients</li>
                <li>Historique de performance</li>
                <li>Taux d'acceptation</li>
                <li>Délais de livraison</li>
              </ul>
            </div>

            {/* Invoice & Payments */}
            <div className="solution-card">
              <div className="solution-icon">💰</div>
              <h3>Facturation et Paiements</h3>
              <p className="solution-desc">
                Générez automatiquement des factures conformes aux normes tunisiennes 
                et suivez vos paiements avec notifications automatiques.
              </p>
              <ul className="features-list">
                <li>Génération factures auto</li>
                <li>Conformité fiscale TN</li>
                <li>Suivi des paiements</li>
                <li>Rappels automatiques</li>
                <li>Intégration bancaire</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Features */}
      <section className="comparative-section">
        <div className="container">
          <h2>Fonctionnalités Communes</h2>
          <p className="section-intro">Outils disponibles pour tous les utilisateurs</p>

          <div className="common-features-grid">
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <h4>Sécurité Avancée</h4>
              <p>Authentification 2FA, chiffrement AES-256, audit complet</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🌍</span>
              <h4>Multi-Devises</h4>
              <p>Dinars, euros et autres devises avec conversion en temps réel</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <h4>Mobile Ready</h4>
              <p>Accès complet via smartphone avec application web optimisée</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🌙</span>
              <h4>Dark Mode</h4>
              <p>Interface sombre pour réduire la fatigue oculaire</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <h4>Multi-Langues</h4>
              <p>Support français, arabe et anglais</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <h4>Rapports Détaillés</h4>
              <p>Export en PDF, Excel avec graphiques interactifs</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <h4>Notifications</h4>
              <p>Alertes en temps réel par email, SMS et application</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <h4>Support 24/7</h4>
              <p>Équipe dédié disponible pour vos questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta">
        <div className="container">
          <h2>Prêt à Explorer les Fonctionnalités?</h2>
          <p>Consultez nos forfaits pour choisir celui qui convient le mieux à vos besoins</p>
          <a href="/pricing" className="cta-button">💳 Voir les Forfaits et Tarification →</a>
        </div>
      </section>
    </div>
    </>
  );
}
