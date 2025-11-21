import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dndMode, setDndMode] = useState(false);
  const [dndUntil, setDndUntil] = useState('');
  const [frequency, setFrequency] = useState('instant');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications?priority=${filter}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDNDMode = (hours) => {
    setDndMode(true);
    const until = new Date(Date.now() + hours * 60 * 60 * 1000);
    setDndUntil(until.toLocaleString('fr-FR'));
  };

  const handleFrequency = async (newFrequency) => {
    setFrequency(newFrequency);
    try {
      await axios.put(`/api/settings/notification-frequency`, 
        { frequency: newFrequency },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="notification-center">
      <h1>Centre des Notifications</h1>

      {/* Paramètres des Notifications */}
      <div className="notification-settings">
        <div className="setting-group">
          <h3>Fréquence des Notifications</h3>
          <div className="frequency-buttons">
            <button 
              className={`freq-btn ${frequency === 'instant' ? 'active' : ''}`}
              onClick={() => handleFrequency('instant')}
            >
              Instantané
            </button>
            <button 
              className={`freq-btn ${frequency === 'daily' ? 'active' : ''}`}
              onClick={() => handleFrequency('daily')}
            >
              Quotidien
            </button>
            <button 
              className={`freq-btn ${frequency === 'weekly' ? 'active' : ''}`}
              onClick={() => handleFrequency('weekly')}
            >
              Hebdomadaire
            </button>
          </div>
        </div>

        <div className="setting-group">
          <h3>Mode Ne pas Déranger</h3>
          {!dndMode ? (
            <div className="dnd-buttons">
              <button onClick={() => handleDNDMode(1)} className="dnd-btn">1 heure</button>
              <button onClick={() => handleDNDMode(4)} className="dnd-btn">4 heures</button>
              <button onClick={() => handleDNDMode(8)} className="dnd-btn">8 heures</button>
            </div>
          ) : (
            <div className="dnd-active">
              <p>✓ Mode Ne pas Déranger activé jusqu'à: {dndUntil}</p>
              <button onClick={() => setDndMode(false)} className="btn-cancel">Annuler</button>
            </div>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="notification-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tous
        </button>
        <button 
          className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
          onClick={() => setFilter('critical')}
        >
          Critique
        </button>
        <button 
          className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
          onClick={() => setFilter('high')}
        >
          Important
        </button>
        <button 
          className={`filter-btn ${filter === 'normal' ? 'active' : ''}`}
          onClick={() => setFilter('normal')}
        >
          Normal
        </button>
      </div>

      {/* Liste des Notifications */}
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="empty-state">Aucune notification</p>
        ) : (
          notifications.map((notif, idx) => (
            <div key={idx} className={`notification-item priority-${notif.priority}`}>
              <div className="notif-header">
                <h3>{notif.title}</h3>
                <span className="priority-badge">{notif.priority}</span>
              </div>
              <p className="notif-message">{notif.message}</p>
              <p className="notif-time">{new Date(notif.created_at).toLocaleString('fr-FR')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
