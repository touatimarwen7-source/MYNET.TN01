import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { procurementAPI } from '../api';

export default function TenderDetail() {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTender();
  }, [id]);

  const fetchTender = async () => {
    setLoading(true);
    try {
      const tenderRes = await procurementAPI.getTender(id);
      setTender(tenderRes.data.tender);
      
      try {
        const offersRes = await procurementAPI.getOffers(id);
        setOffers(offersRes.data.offers || []);
      } catch (err) {
        // Offers might not be accessible
      }
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في تحميل المناقصة');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!tender) return <div className="alert alert-error">المناقصة غير موجودة</div>;

  return (
    <div>
      <button onClick={() => window.history.back()} className="btn btn-secondary">
        ← رجوع
      </button>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>{tender.title}</h2>
        <span className={`badge badge-${tender.status}`}>{tender.status}</span>

        <div style={{ marginTop: '1.5rem', lineHeight: '1.8' }}>
          <p><strong>الوصف:</strong> {tender.description}</p>
          <p><strong>الفئة:</strong> {tender.category}</p>
          <p><strong>الميزانية:</strong> {tender.budget_min} - {tender.budget_max} {tender.currency}</p>
          <p><strong>آخر تعديل:</strong> {new Date(tender.updated_at).toLocaleDateString('ar-TN')}</p>
          
          {tender.deadline && (
            <p><strong>موعد الإغلاق:</strong> {new Date(tender.deadline).toLocaleDateString('ar-TN')}</p>
          )}
        </div>

        {tender.requirements && tender.requirements.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>المتطلبات</h3>
            <ul>
              {tender.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {offers.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>العروض المقدمة</h3>
          <div className="tender-list">
            {offers.map(offer => (
              <div key={offer.id} className="card">
                <p><strong>المورد:</strong> {offer.full_name}</p>
                <p><strong>المبلغ:</strong> {offer.total_amount} {offer.currency}</p>
                <p><strong>وقت التسليم:</strong> {offer.delivery_time}</p>
                <p><strong>الحالة:</strong> {offer.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
