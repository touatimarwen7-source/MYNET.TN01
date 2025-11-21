import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { procurementAPI } from '../api';

export default function CreateOffer() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // خطوات النموذج
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [selectedLineItemIndex, setSelectedLineItemIndex] = useState(null);
  const [catalogProducts, setCatalogProducts] = useState([]);

  // التحقق من انتهاء صلاحية المناقصة
  const isDeadlinePassed = tender && new Date() > new Date(tender.deadline);

  const [offerData, setOfferData] = useState({
    supplier_ref_number: '',
    validity_period_days: 30,
    payment_terms: 'Net30',
    technical_proposal: '',
    line_items: [],
    attachments: [],
    commitment: false
  });

  useEffect(() => {
    fetchTender();
  }, [tenderId]);

  const fetchTender = async () => {
    try {
      const response = await procurementAPI.getTender(tenderId);
      setTender(response.data.tender);
      
      // تهيئة بنود المناقصة
      const items = response.data.tender.requirements || [];
      setOfferData(prev => ({
        ...prev,
        line_items: items.map((item, idx) => ({
          id: idx,
          description: item.description || item,
          quantity: item.quantity || 1,
          unit: item.unit || 'piece',
          unit_price: '',
          total_price: 0,
          specifications: '',
          partial_quantity: null,
          is_partial: false,
          technical_response: ''
        }))
      }));
    } catch (err) {
      setError('خطأ في تحميل المناقصة: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogProducts = async () => {
    try {
      const response = await procurementAPI.getMyOffers(); // محاكاة الكتالوج
      setCatalogProducts(response.data.offers || []);
    } catch (err) {
      console.error('خطأ في جلب الكتالوج:', err);
    }
  };

  const handleOpenCatalog = (itemIndex) => {
    setSelectedLineItemIndex(itemIndex);
    setShowCatalogModal(true);
    fetchCatalogProducts();
  };

  const handleSelectFromCatalog = (product) => {
    const newItems = [...offerData.line_items];
    newItems[selectedLineItemIndex] = {
      ...newItems[selectedLineItemIndex],
      unit_price: product.total_amount || 0,
      specifications: product.description || ''
    };
    newItems[selectedLineItemIndex].total_price = newItems[selectedLineItemIndex].unit_price * newItems[selectedLineItemIndex].quantity;
    setOfferData(prev => ({ ...prev, line_items: newItems }));
    setShowCatalogModal(false);
  };

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...offerData.line_items];
    newItems[index][field] = field === 'unit_price' ? parseFloat(value) || 0 : value;

    if (field === 'unit_price' || field === 'partial_quantity' || field === 'is_partial') {
      const item = newItems[index];
      const quantity = item.is_partial ? (item.partial_quantity || 0) : item.quantity;
      item.total_price = (item.unit_price || 0) * quantity;
    }

    setOfferData(prev => ({ ...prev, line_items: newItems }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setOfferData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setOfferData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const getTotalBidAmount = () => {
    return offerData.line_items.reduce((sum, item) => sum + (item.total_price || 0), 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDeadlinePassed) {
      setError(`❌ فشلت عملية الإرسال. المناقصة مغلقة منذ ${new Date(tender.deadline).toLocaleDateString('ar-TN')} الساعة ${new Date(tender.deadline).toLocaleTimeString('ar-TN')}`);
      return;
    }

    if (!offerData.commitment) {
      setError('يجب عليك التعهد بالموافقة على جميع الشروط');
      return;
    }

    const invalidItems = offerData.line_items.filter(item => !item.unit_price || item.unit_price === 0);
    if (invalidItems.length > 0) {
      setError('يرجى ملء أسعار جميع البنود');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('tender_id', tenderId);
      formData.append('supplier_ref_number', offerData.supplier_ref_number);
      formData.append('validity_period_days', offerData.validity_period_days);
      formData.append('payment_terms', offerData.payment_terms);
      formData.append('technical_proposal', offerData.technical_proposal);
      formData.append('line_items', JSON.stringify(offerData.line_items));
      formData.append('total_amount', getTotalBidAmount());

      offerData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      await procurementAPI.createOffer(formData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/my-offers');
      }, 2500);
    } catch (err) {
      setError('❌ خطأ في إرسال العرض: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">جاري تحميل المناقصة...</div>;
  if (!tender) return <div className="alert alert-error">المناقصة غير موجودة</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <button onClick={() => window.history.back()} className="btn btn-secondary">
        ← رجوع
      </button>

      {/* رسالة الخطأ الكبيرة للمناقصات المنتهية */}
      {isDeadlinePassed && (
        <div style={{
          marginTop: '1rem',
          padding: '1.5rem',
          backgroundColor: '#f8d7da',
          border: '2px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          textAlign: 'center'
        }}>
          <h3>⏰ آسف، هذه المناقصة مغلقة</h3>
          <p>موعد الإغلاق: {new Date(tender.deadline).toLocaleDateString('ar-TN')} الساعة {new Date(tender.deadline).toLocaleTimeString('ar-TN')}</p>
          <p>لا يمكنك تقديم عرض بعد انتهاء الموعد المحدد.</p>
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}
      {success && (
        <div className="alert alert-success" style={{ marginTop: '1rem' }}>
          ✅ تم إرسال عرضك بنجاح وتشفيره بأمان! جاري التحويل إلى صفحة عروضي...
        </div>
      )}

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>📝 نموذج تقديم العرض الآمن</h2>
        <p style={{ color: '#666' }}>
          <strong>المناقصة:</strong> {tender.title}
        </p>

        {/* شرائط الخطوات */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: step === s ? '#007bff' : step > s ? '#28a745' : '#e9ecef',
                color: step === s || step > s ? 'white' : '#666',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: step === s ? 'bold' : 'normal'
              }}
              onClick={() => !isDeadlinePassed && step > s && setStep(s)}
            >
              {s === 1 && '1️⃣ البيانات الأساسية'}
              {s === 2 && '2️⃣ بنود المناقصة'}
              {s === 3 && '3️⃣ المراجعة والإرسال'}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* الخطوة 1: البيانات الأساسية */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>📋 البيانات الأساسية للعرض</h3>

              <div>
                <label><strong>رقم مرجع المورد (اختياري)</strong></label>
                <input
                  type="text"
                  value={offerData.supplier_ref_number}
                  onChange={(e) => setOfferData({...offerData, supplier_ref_number: e.target.value})}
                  placeholder="رقم داخلي لتسهيل التتبع"
                  style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>لا يؤثر على التقييم</small>
              </div>

              <div>
                <label><strong>فترة صلاحية العرض (بالأيام)</strong></label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={offerData.validity_period_days}
                  onChange={(e) => setOfferData({...offerData, validity_period_days: parseInt(e.target.value)})}
                  style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>يجب أن تكون أقل من 365 يوم</small>
              </div>

              <div>
                <label><strong>شروط الدفع المقترحة</strong></label>
                <select
                  value={offerData.payment_terms}
                  onChange={(e) => setOfferData({...offerData, payment_terms: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="Net30">Net 30 - خلال 30 يوم</option>
                  <option value="Net60">Net 60 - خلال 60 يوم</option>
                  <option value="PaymentInAdvance">الدفع المقدم</option>
                  <option value="CashOnDelivery">الدفع عند الاستلام</option>
                </select>
              </div>

              <div>
                <label><strong>الاقتراح التقني</strong></label>
                <textarea
                  rows="5"
                  value={offerData.technical_proposal}
                  onChange={(e) => setOfferData({...offerData, technical_proposal: e.target.value})}
                  placeholder="اشرح كيفية تقديمك للخدمة/المنتج والمواصفات التقنية..."
                  style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label><strong>وثائق المورد (PDF, DOCX)</strong></label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  style={{ marginTop: '0.5rem' }}
                />
                {offerData.attachments.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p><strong>الملفات المرفوعة:</strong></p>
                    <ul style={{ paddingRight: '1.5rem' }}>
                      {offerData.attachments.map((file, idx) => (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>{file.name}</span>
                          <button type="button" onClick={() => removeAttachment(idx)} className="btn btn-small">حذف</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem', alignSelf: 'flex-end' }}
              >
                التالي ← بنود المناقصة
              </button>
            </div>
          )}

          {/* الخطوة 2: بنود المناقصة */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>📦 الرد على بنود المناقصة</h3>

              {offerData.line_items.length === 0 ? (
                <div className="alert alert-info">لا توجد بنود في هذه المناقصة</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>الوصف</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>الكمية</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>الوحدة</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>🔒 السعر الوحدوي</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>الإجمالي</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #ddd' }}>الكتالوج</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offerData.line_items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '0.75rem' }}>{item.description}</td>
                          <td style={{ padding: '0.75rem' }}>{item.quantity}</td>
                          <td style={{ padding: '0.75rem' }}>{item.unit}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unit_price}
                              onChange={(e) => handleLineItemChange(idx, 'unit_price', e.target.value)}
                              placeholder="السعر"
                              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fffbf0' }}
                            />
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                            {item.total_price.toFixed(2)} {tender.currency}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenCatalog(idx)}
                              className="btn btn-small"
                              style={{ padding: '0.5rem' }}
                            >
                              📚 من الكتالوج
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '4px', textAlign: 'center' }}>
                <strong>الإجمالي المالي للعرض: </strong>
                <span style={{ fontSize: '1.3rem', color: '#007bff', fontWeight: 'bold' }}>
                  {getTotalBidAmount()} {tender.currency}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  ← السابق
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  التالي - المراجعة ←
                </button>
              </div>
            </div>
          )}

          {/* الخطوة 3: المراجعة والإرسال */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>✅ المراجعة النهائية والإرسال الآمن</h3>

              <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4>📊 ملخص العرض</h4>
                <div style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
                  <p><strong>رقم المرجع:</strong> {offerData.supplier_ref_number || 'بدون'}</p>
                  <p><strong>فترة الصلاحية:</strong> {offerData.validity_period_days} يوم</p>
                  <p><strong>شروط الدفع:</strong> {offerData.payment_terms}</p>
                  <p><strong>عدد البنود:</strong> {offerData.line_items.length}</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#007bff' }}>
                    💰 الإجمالي المالي: {getTotalBidAmount()} {tender.currency}
                  </p>
                  <p><strong>الملفات المرفوعة:</strong> {offerData.attachments.length} ملف</p>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', color: '#856404' }}>
                <strong>🔒 تنبيه أمان:</strong>
                <p>سيتم تشفير جميع بيانات عرضك المالية بتقنية AES-256. فقط المشتري يمكنه فك التشفير والاطلاع على التفاصيل المالية.</p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', color: '#155724' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={offerData.commitment}
                    onChange={(e) => setOfferData({...offerData, commitment: e.target.checked})}
                    style={{ marginTop: '0.25rem' }}
                  />
                  <span>
                    <strong>✓ تعهد الإرسال</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                      أؤكد أنني قرأت وفهمت جميع شروط وبنود المناقصة، وأن هذا العرض سارٍ للفترة المحددة أعلاه.
                    </p>
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1.5rem' }}
                  disabled={submitting || isDeadlinePassed}
                >
                  ← العودة لتعديل البنود
                </button>
                <button
                  type="submit"
                  disabled={submitting || !offerData.commitment || isDeadlinePassed}
                  className="btn btn-primary"
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    backgroundColor: isDeadlinePassed ? '#ccc' : undefined,
                    cursor: isDeadlinePassed || !offerData.commitment ? 'not-allowed' : 'pointer',
                    opacity: submitting || !offerData.commitment ? 0.6 : 1
                  }}
                >
                  {submitting ? '⏳ جاري تشفير وإرسال العرض...' : '🔐 تشفير وإرسال العرض الآن'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* نافذة الكتالوج */}
      {showCatalogModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '90%'
          }}>
            <h3>اختر من كتالوجك</h3>
            {catalogProducts.length === 0 ? (
              <p className="alert alert-info">لا توجد منتجات في كتالوجك</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {catalogProducts.map((product, idx) => (
                  <div key={idx} style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }} onClick={() => handleSelectFromCatalog(product)}>
                    <p><strong>{product.description || 'منتج'}</strong></p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>السعر: {product.total_amount} {tender.currency}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowCatalogModal(false)}
              className="btn btn-secondary"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
