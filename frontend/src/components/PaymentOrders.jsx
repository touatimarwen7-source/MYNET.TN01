import { useState, useEffect } from 'react';
import { procurementAPI } from '../api';
import '../styles/payment-orders.css';

export default function PaymentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPaymentOrders();
  }, []);

  const fetchPaymentOrders = async () => {
    try {
      setLoading(true);
      // This would fetch the purchase orders from the API
      // For now, we'll fetch purchase orders which are payment orders
      const response = await procurementAPI.getPurchaseOrders?.() || { data: { purchaseOrders: [] } };
      setOrders(response.data.purchaseOrders || []);
    } catch (error) {
      console.error('خطأ في تحميل أوامر الصرف:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'قيد الانتظار', class: 'status-pending' },
      approved: { label: 'موافق عليه', class: 'status-approved' },
      in_progress: { label: 'قيد الإنجاز', class: 'status-in-progress' },
      completed: { label: 'مكتمل', class: 'status-completed' },
      cancelled: { label: 'ملغى', class: 'status-cancelled' }
    };
    return statusMap[status] || { label: status, class: 'status-default' };
  };

  const formatCurrency = (amount, currency = 'TND') => {
    return new Intl.NumberFormat('ar-TN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return <div className="loading">جاري تحميل أوامر الصرف...</div>;
  }

  return (
    <div className="payment-orders-section">
      <div className="section-header">
        <h2>أوامر الصرف</h2>
        <div className="section-meta">
          <span className="meta-badge">{filteredOrders.length} أمر</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {[
          { value: 'all', label: 'الكل' },
          { value: 'pending', label: 'قيد الانتظار' },
          { value: 'approved', label: 'موافق عليه' },
          { value: 'in_progress', label: 'قيد الإنجاز' },
          { value: 'completed', label: 'مكتمل' }
        ].map(tab => (
          <button
            key={tab.value}
            className={`filter-tab ${filter === tab.value ? 'active' : ''}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-message">لا توجد أوامر صرف</p>
          <p className="empty-submessage">سيظهر هنا عند إنشاء أوامر جديدة</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-number">{order.po_number || 'رقم غير محدد'}</h3>
                  <p className="order-tender">{order.tender_title || 'مناقصة'}</p>
                </div>
                <div className={`order-status ${getStatusBadge(order.status).class}`}>
                  {getStatusBadge(order.status).label}
                </div>
              </div>

              <div className="order-body">
                <div className="order-row">
                  <span className="row-label">المورد:</span>
                  <span className="row-value">{order.supplier_name || 'غير محدد'}</span>
                </div>
                <div className="order-row">
                  <span className="row-label">المبلغ الإجمالي:</span>
                  <span className="row-value amount">{formatCurrency(order.total_amount, order.currency)}</span>
                </div>
                <div className="order-row">
                  <span className="row-label">شروط الدفع:</span>
                  <span className="row-value">{order.payment_terms || 'عادية'}</span>
                </div>
                <div className="order-row">
                  <span className="row-label">تاريخ الإنشاء:</span>
                  <span className="row-value">{new Date(order.created_at).toLocaleDateString('ar-TN')}</span>
                </div>
              </div>

              <div className="order-actions">
                <button className="action-btn view-btn">عرض التفاصيل</button>
                <button className="action-btn update-btn">تحديث الحالة</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
