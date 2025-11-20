import { useState, useEffect } from 'react';
import { authAPI } from '../api';

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data.user);
      setFormData(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      setProfile(response.data.user);
      setEditing(false);
      setSuccess('تم تحديث الملف الشخصي بنجاح');
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (!profile) return <div className="alert alert-error">لم يتم العثور على الملف الشخصي</div>;

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2>الملف الشخصي</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!editing ? (
        <div>
          <div className="card">
            <p><strong>اسم المستخدم:</strong> {profile.username}</p>
            <p><strong>البريد الإلكتروني:</strong> {profile.email}</p>
            <p><strong>الاسم الكامل:</strong> {profile.full_name}</p>
            <p><strong>رقم الهاتف:</strong> {profile.phone || '-'}</p>
            <p><strong>الدور:</strong> {profile.role}</p>
            <p><strong>اسم الشركة:</strong> {profile.company_name || '-'}</p>
            <p><strong>حالة التحقق:</strong> {profile.is_verified ? '✓ مُتحقق منه' : '✗ غير مُتحقق'}</p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>
              تم الإنشاء: {new Date(profile.created_at).toLocaleDateString('ar-TN')}
            </p>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => setEditing(true)}
            style={{ marginTop: '1rem' }}
          >
            تعديل البيانات
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>الاسم الكامل</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>اسم الشركة</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>رقم تسجيل الشركة</label>
            <input
              type="text"
              name="company_registration"
              value={formData.company_registration || ''}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setEditing(false);
                setFormData(profile);
              }}
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
