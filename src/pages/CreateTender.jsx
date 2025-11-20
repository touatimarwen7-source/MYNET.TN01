import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { procurementAPI } from '../api';

export default function CreateTender() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    budget_min: '',
    budget_max: '',
    currency: 'TND',
    deadline: '',
    requirements: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await procurementAPI.createTender(formData);
      navigate(`/tender/${response.data.tender.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في إنشاء المناقصة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '700px' }}>
      <h2>إنشاء مناقصة جديدة</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>العنوان *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>الوصف *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>الفئة</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="technology">تكنولوجيا</option>
            <option value="supplies">توريدات</option>
            <option value="construction">بناء</option>
            <option value="services">خدمات</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>الحد الأدنى للميزانية</label>
            <input
              type="number"
              name="budget_min"
              value={formData.budget_min}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>الحد الأقصى للميزانية</label>
            <input
              type="number"
              name="budget_max"
              value={formData.budget_max}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>العملة</label>
          <select name="currency" value={formData.currency} onChange={handleChange}>
            <option value="TND">دينار تونسي</option>
            <option value="USD">دولار أمريكي</option>
            <option value="EUR">يورو</option>
          </select>
        </div>

        <div className="form-group">
          <label>موعد الإغلاق</label>
          <input
            type="datetime-local"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'إنشاء المناقصة'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/tenders')}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
