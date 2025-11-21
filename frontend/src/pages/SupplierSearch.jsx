import { useState, useEffect } from 'react';
import { procurementAPI } from '../api';

export default function SupplierSearch() {
  const [tenders, setTenders] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    budgetMin: 0,
    budgetMax: 1000000
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenders();
    fetchRecommended();
  }, [filters]);

  const fetchTenders = async () => {
    try {
      const response = await procurementAPI.getTenders(filters);
      setTenders(response.data.tenders || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchRecommended = async () => {
    try {
      const response = await procurementAPI.getTenders({ recommended: true });
      setRecommended(response.data.tenders || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const TenderCard = ({ tender, isRecommended }) => (
    <div className={`tender-card ${isRecommended ? 'recommended' : ''}`}>
      {isRecommended && <span className="badge-recommended">Recommandé pour vous</span>}
      <h3>{tender.title}</h3>
      <div className="tender-info">
        <p><strong>Catégorie:</strong> {tender.category}</p>
        <p><strong>Localisation:</strong> {tender.location}</p>
        <p><strong>Budget:</strong> {tender.budget_max} {tender.currency}</p>
        <p><strong>Date d'Expiration:</strong> {new Date(tender.closing_date).toLocaleDateString('fr-FR')}</p>
      </div>
      <button className="btn-bid">Voir les Détails</button>
    </div>
  );

  if (loading) return <div className="loading">Chargement en cours...</div>;

  return (
    <div className="supplier-search">
      <h1>Recherche d'Appels d'Offres</h1>

      {/* Filtres Intelligents */}
      <div className="filters-panel">
        <div className="filter-group">
          <label>Catégorie:</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">Toutes les Catégories</option>
            <option value="supplies">Fournitures</option>
            <option value="services">Services</option>
            <option value="construction">Construction</option>
            <option value="technology">Technologie</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Localisation:</label>
          <select name="location" value={filters.location} onChange={handleFilterChange}>
            <option value="">Tous les Emplacements</option>
            <option value="tunis">Tunis</option>
            <option value="sfax">Sfax</option>
            <option value="sousse">Sousse</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Budget:</label>
          <input 
            type="number" 
            name="budgetMin" 
            placeholder="من" 
            value={filters.budgetMin}
            onChange={handleFilterChange}
          />
          <input 
            type="number" 
            name="budgetMax" 
            placeholder="إلى" 
            value={filters.budgetMax}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* المناقصات المقترحة */}
      {recommended.length > 0 && (
        <div className="recommended-section">
          <h2>مقترحة لك</h2>
          <div className="tenders-grid">
            {recommended.map(tender => (
              <TenderCard key={tender.id} tender={tender} isRecommended={true} />
            ))}
          </div>
        </div>
      )}

      {/* جميع المناقصات */}
      <div className="all-tenders-section">
        <h2>جميع المناقصات ({tenders.length})</h2>
        {tenders.length === 0 ? (
          <p className="empty-state">لم يتم العثور على مناقصات</p>
        ) : (
          <div className="tenders-grid">
            {tenders.map(tender => (
              <TenderCard key={tender.id} tender={tender} isRecommended={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
