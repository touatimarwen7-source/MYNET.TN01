import { useState, useEffect } from 'react';
import axios from 'axios';
import { setPageTitle } from '../utils/pageTitle';

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({ action: '', user_id: '', date_from: '', date_to: '' });
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Logs d\'Audit');
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      const queryParams = new URLSearchParams(Object.entries(filter).filter(([_, v]) => v));
      const response = await axios.get(`http://localhost:3000/api/admin/audit-logs?${queryParams}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/admin/audit-logs/export/${format}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs.${format === 'csv' ? 'csv' : 'jsonl'}`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      alert('Erreur lors de l\'export des logs');
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;

  return (
    <div className="audit-log-viewer">
      <h1>Journal d'Audit Complet</h1>

      <div className="filters-panel">
        <div className="filter-group">
          <label>Action:</label>
          <select value={filter.action} onChange={(e) => setFilter({...filter, action: e.target.value})}>
            <option value="">Tous</option>
            <option value="CREATE">Créer</option>
            <option value="UPDATE">Modifier</option>
            <option value="DELETE">Supprimer</option>
            <option value="APPROVE">Approuver</option>
            <option value="LOGIN">Connexion</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date début:</label>
          <input type="date" value={filter.date_from} onChange={(e) => setFilter({...filter, date_from: e.target.value})} />
        </div>

        <div className="filter-group">
          <label>Date fin:</label>
          <input type="date" value={filter.date_to} onChange={(e) => setFilter({...filter, date_to: e.target.value})} />
        </div>

        <button className="btn btn-primary" onClick={fetchLogs}>Filtrer</button>
        <button className="btn btn-secondary" onClick={() => handleExport('csv')}>CSV</button>
        <button className="btn btn-secondary" onClick={() => handleExport('json')}>JSON</button>
      </div>

      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>Heure</th>
              <th>Utilisateur</th>
              <th>Action</th>
              <th>Ressource</th>
              <th>Statut</th>
              <th>Adresse IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx} onClick={() => setSelectedLog(log)} className="clickable">
                <td>{new Date(log.timestamp).toLocaleString('fr-FR')}</td>
                <td>{log.user_email}</td>
                <td><span className="action-badge">{log.action}</span></td>
                <td>{log.resource_type}: {log.resource_id}</td>
                <td><span className={`status-${log.status}`}>{log.status}</span></td>
                <td>{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLog && (
        <div className="log-detail">
          <h3>Détails de l'événement</h3>
          <div className="detail-content">
            <p><strong>Utilisateur:</strong> {selectedLog.user_email}</p>
            <p><strong>Action:</strong> {selectedLog.action}</p>
            <p><strong>Heure:</strong> {new Date(selectedLog.timestamp).toLocaleString('fr-FR')}</p>
            <p><strong>Ressource:</strong> {selectedLog.resource_type} ({selectedLog.resource_id})</p>
            <p><strong>Adresse IP:</strong> {selectedLog.ip_address}</p>
            <p><strong>Statut:</strong> {selectedLog.status}</p>
            {selectedLog.details && (
              <details>
                <summary>Détails techniques</summary>
                <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
