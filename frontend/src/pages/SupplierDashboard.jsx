import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { procurementAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';
import DashboardCards from '../components/DashboardCards';
import QuickActions from '../components/QuickActions';
import ImportantDocuments from '../components/ImportantDocuments';
import '../styles/dashboard-header.css';
import '../styles/dashboardCards.css';
import '../styles/dashboard-general.css';

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeTenders: 0,
    myOffers: 0,
    conversionRate: 0,
    catalogItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Tableau de Bord Fournisseur');
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulation de données - remplacer par API réels
      setStats({
        activeTenders: 42,
        myOffers: 18,
        conversionRate: 35,
        catalogItems: 156
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cartes de résumé des services
  const summaryCards = [
    {
      icon: '📋',
      label: 'Appels Disponibles',
      value: stats.activeTenders,
      subtitle: 'Appels actifs',
      status: 'active',
      type: 'metric'
    },
    {
      icon: '💼',
      label: 'Mes Offres',
      value: stats.myOffers,
      subtitle: 'Soumises',
      status: 'active',
      type: 'metric'
    },
    {
      icon: '📊',
      label: 'Taux Conversion',
      value: `${stats.conversionRate}%`,
      subtitle: 'Taux de réussite',
      progress: stats.conversionRate,
      status: stats.conversionRate >= 30 ? 'active' : 'pending',
      type: 'metric'
    },
    {
      icon: '📦',
      label: 'Mon Catalogue',
      value: stats.catalogItems,
      subtitle: 'Articles',
      status: 'active',
      type: 'metric'
    }
  ];

  // Actions rapides pour fournisseur
  const quickActions = [
    {
      icon: '📂',
      label: 'Parcourir',
      path: '/tenders',
      description: 'Voir tous les appels d\'offres'
    },
    {
      icon: '➕',
      label: 'Nouvelle Offre',
      priority: 'high',
      onClick: () => navigate('/tenders'),
      description: 'Soumettre une nouvelle offre'
    },
    {
      icon: '💼',
      label: 'Mes Offres',
      path: '/my-offers',
      description: 'Voir mes offres en cours'
    },
    {
      icon: '📦',
      label: 'Mon Catalogue',
      path: '/supplier-catalog',
      description: 'Gérer mon catalogue produits'
    }
  ];

  // Documents importants (éligibilité, certifications, etc.)
  const importantDocs = [
    {
      icon: '🔐',
      title: 'Certificat ISO: Expire dans 45 jours',
      meta: 'ISO 9001:2015',
      priority: 'high',
      details: 'Votre certificat ISO 9001:2015 expire dans 45 jours. Renouvellement recommandé.',
      action: { label: 'Renouveler', path: '/compliance/iso-renewal' }
    },
    {
      icon: '✅',
      title: 'Qualifications à Jour',
      meta: '12/15 critères',
      priority: 'medium',
      details: 'Vous répondez à 12 critères d\'éligibilité sur 15. Complétez votre dossier.',
      action: { label: 'Compléter', path: '/supplier-profile' }
    },
    {
      icon: '📄',
      title: 'Factures Non Payées',
      meta: '2 factures',
      priority: 'medium',
      details: 'Vous avez 2 factures en attente de paiement de vos clients',
      action: { label: 'Consulter', path: '/supplier-invoices' }
    },
    {
      icon: '⭐',
      title: 'Avis Client',
      meta: '4.8/5 (28 avis)',
      priority: 'normal',
      details: 'Excellent! Votre note client reste excellente avec 28 avis positifs.'
    }
  ];

  if (loading) return <div className="loading">Chargement en cours...</div>;

  return (
    <div className="supplier-dashboard">
      {/* Professional Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Tableau de Bord Fournisseur</h1>
          <p className="header-subtitle">Trouvez et répondez aux appels d'offres</p>
        </div>
        <div className="header-meta">
          <span className="meta-item">Appels Disponibles: <strong>{stats.activeTenders}</strong></span>
          <span className="meta-item">Mes Offres: <strong>{stats.myOffers}</strong></span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-section">
        <h2>Vue d'ensemble</h2>
        <DashboardCards cards={summaryCards} />
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Actions Rapides</h2>
        <QuickActions actions={quickActions} />
      </div>

      {/* Important Documents - Eligibility & Certifications */}
      <div className="dashboard-section">
        <ImportantDocuments 
          documents={importantDocs} 
          title="Documents d'Éligibilité & Certifications" 
        />
      </div>
    </div>
  );
}
