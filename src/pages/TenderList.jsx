import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { procurementAPI } from '../api';

export default function TenderList() {
  const [tenders, setTenders] = useState([]);
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenders();
  }, [filters]);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const response = await procurementAPI.getTenders(filters);
      setTenders(response.data.tenders || []);
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في تحميل المناقصات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>المناقصات المتاحة</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <select 
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">جميع الحالات</option>
          <option value="draft">مسودة</option>
          <option value="published">منشورة</option>
          <option value="closed">مغلقة</option>
        </select>
        <select 
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">جميع الفئات</option>
          <option value="technology">تكنولوجيا</option>
          <option value="supplies">توريدات</option>
          <option value="construction">بناء</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : tenders.length === 0 ? (
        <div className="alert alert-info">لا توجد مناقصات</div>
      ) : (
        <div className="tender-list">
          {tenders.map(tender => (
            <div 
              key={tender.id} 
              className="tender-item"
              onClick={() => navigate(`/tender/${tender.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 className="tender-title">{tender.title}</h3>
                  <p className="tender-description">{tender.description}</p>
                </div>
                <span className={`badge badge-${tender.status}`}>{tender.status}</span>
              </div>
              <div className="tender-meta">
                <span>💰 {tender.budget_min} - {tender.budget_max} {tender.currency}</span>
                <span>📂 {tender.category}</span>
                <span>📅 {new Date(tender.created_at).toLocaleDateString('ar-TN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
