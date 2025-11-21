import { useState, useEffect } from 'react';
import { setPageTitle } from '../utils/pageTitle';
import DashboardCards from '../components/DashboardCards';
import '../styles/dashboard-header.css';
import '../styles/dashboardCards.css';
import '../styles/dashboard-general.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    systemHealth: 0,
    pendingAudits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Tableau de Contrôle Admin');
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setStats({
        totalUsers: 1254,
        activeSessions: 89,
        systemHealth: 99.8,
        pendingAudits: 12
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;

  const summaryCards = [
    {
      icon: '👥',
      label: 'Utilisateurs Totaux',
      value: stats.totalUsers,
      subtitle: 'Utilisateurs enregistrés',
      status: 'active',
      type: 'metric'
    },
    {
      icon: '🔗',
      label: 'Sessions Actives',
      value: stats.activeSessions,
      subtitle: 'Connectés maintenant',
      status: 'active',
      type: 'metric'
    },
    {
      icon: '💪',
      label: 'Santé Système',
      value: `${stats.systemHealth}%`,
      subtitle: 'État opérationnel',
      progress: Math.round(stats.systemHealth),
      status: stats.systemHealth >= 99 ? 'active' : 'warning',
      type: 'metric'
    },
    {
      icon: '📋',
      label: 'Audits en Attente',
      value: stats.pendingAudits,
      subtitle: 'À traiter',
      status: stats.pendingAudits > 0 ? 'warning' : 'active',
      type: 'metric'
    }
  ];

  return (
    <div className="admin-dashboard">
      {/* Professional Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Tableau de Contrôle Admin</h1>
          <p className="header-subtitle">Gestion de la plateforme et des utilisateurs</p>
        </div>
        <div className="header-meta">
          <span className="meta-item">Santé: <strong>{stats.systemHealth}%</strong></span>
          <span className="meta-item">Sessions: <strong>{stats.activeSessions}</strong></span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-section">
        <h2>Vue d'ensemble</h2>
        <DashboardCards cards={summaryCards} />
      </div>

      {/* Admin Actions */}
      <div className="dashboard-section">
        <h2>Actions Rapides</h2>
        <div className="admin-actions">
          <a href="/admin/users" className="action-link">Gestion Utilisateurs</a>
          <a href="/admin/audit-logs" className="action-link">Journaux d'Audit</a>
          <a href="/admin/tenders" className="action-link">Appels d'Offres</a>
          <a href="/admin/settings" className="action-link">Configuration</a>
        </div>
      </div>
    </div>
  );
}
