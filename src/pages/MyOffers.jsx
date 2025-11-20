import { useState, useEffect } from 'react';
import { procurementAPI } from '../api';

export default function MyOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await procurementAPI.getMyOffers();
      setOffers(response.data.offers || []);
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في تحميل العروض');
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = filter 
    ? offers.filter(o => o.status === filter)
    : offers;

  return (
    <div>
      <h2>عروضي</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">جميع الحالات</option>
          <option value="submitted">مرسلة</option>
          <option value="evaluated">مقيمة</option>
          <option value="accepted">مقبولة</option>
          <option value="rejected">مرفوضة</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : filteredOffers.length === 0 ? (
        <div className="alert alert-info">لا توجد عروض</div>
      ) : (
        <div className="tender-list">
          {filteredOffers.map(offer => (
            <div key={offer.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{offer.tender_title}</h3>
                  <p style={{ color: '#666' }}>رقم العرض: {offer.offer_number}</p>
                </div>
                <span className={`badge badge-${offer.status}`}>{offer.status}</span>
              </div>

              <div style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                <p><strong>المبلغ:</strong> {offer.total_amount} {offer.currency}</p>
                <p><strong>وقت التسليم:</strong> {offer.delivery_time}</p>
                
                {offer.evaluation_score && (
                  <p><strong>درجة التقييم:</strong> {offer.evaluation_score}/100</p>
                )}
                
                {offer.evaluation_notes && (
                  <p><strong>ملاحظات التقييم:</strong> {offer.evaluation_notes}</p>
                )}

                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  تم التقديم: {new Date(offer.submitted_at).toLocaleDateString('ar-TN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
