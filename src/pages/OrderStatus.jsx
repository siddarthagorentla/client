import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function OrderStatus() {
  const { docId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId') || '';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prevStatus, setPrevStatus] = useState(null);

  useEffect(() => {
    if (!docId) return;

    // Real-time listener for order status updates
    const unsubscribe = onSnapshot(doc(db, 'orders', docId), (docSnap) => {
      if (docSnap.exists()) {
        const orderData = docSnap.data();
        setOrder(orderData);

        // Play sound and vibrate when status changes to 'ready'
        if (prevStatus && prevStatus !== 'ready' && orderData.status === 'ready') {
          // Vibrate if supported
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }
          // Try to play a notification sound
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkZqTjIOCg4mQlZeUjoWCgYWKj5KSkY2JhoWGiIqLi4qJiIeGhoaGhoaGh4eHh4eHh4eHh4eHh4eHh4eIiIiIiIiIiIiIh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4aGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaG');
            audio.play().catch(() => {});
          } catch (e) {}
        }

        setPrevStatus(orderData.status);
      }
      setLoading(false);
    }, (err) => {
      console.error('Error listening to order:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [docId]);

  if (loading) {
    return (
      <div className="page order-page">
        <div className="loading-state">
          <div className="pulse-loader"></div>
          <p>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page order-page">
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <h2>Order not found</h2>
          <p>This order doesn't exist or has been removed.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  const isReady = order.status === 'ready';
  const isPreparing = order.status === 'preparing';

  return (
    <div className="page order-page">
      <header className="page-header">
        <h1>Order Status</h1>
      </header>

      {/* Order ID Card */}
      <div className={`order-status-card ${isReady ? 'status-ready' : 'status-preparing'}`}>
        <div className="status-icon-large">
          {isReady ? '✅' : '👨‍🍳'}
        </div>
        <div className="order-id-display">
          <span className="order-id-label">Order ID</span>
          <span className="order-id-value">{order.orderId || orderId}</span>
        </div>
        <div className={`status-badge ${isReady ? 'badge-ready' : 'badge-preparing'}`}>
          {isReady ? '🎉 READY FOR PICKUP!' : '🔥 Preparing...'}
        </div>
        {isPreparing && (
          <p className="status-message">
            Your order is being freshly prepared. We'll notify you when it's ready!
          </p>
        )}
        {isReady && (
          <p className="status-message ready-message">
            Your order is ready! Please collect it from the counter.
          </p>
        )}
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className="step completed">
          <div className="step-dot"></div>
          <span>Order Placed</span>
        </div>
        <div className="step-line completed-line"></div>
        <div className={`step ${isPreparing || isReady ? 'completed' : ''}`}>
          <div className="step-dot"></div>
          <span>Preparing</span>
        </div>
        <div className={`step-line ${isReady ? 'completed-line' : ''}`}></div>
        <div className={`step ${isReady ? 'completed' : ''}`}>
          <div className="step-dot"></div>
          <span>Ready!</span>
        </div>
      </div>

      {/* Order Details */}
      <div className="order-details-card">
        <h2 className="section-subtitle">Order Details</h2>
        <div className="detail-row">
          <span className="detail-label">Customer</span>
          <span className="detail-value">{order.customerName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Phone</span>
          <span className="detail-value">{order.customerPhone}</span>
        </div>
        <div className="order-items-list">
          {order.items?.map((item, i) => (
            <div key={i} className="order-item-row">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="order-total-row">
          <span>Total Paid</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>

      {/* New Order Button */}
      <button className="btn-primary btn-new-order" onClick={() => navigate('/')}>
        🌶️ Order Again
      </button>
    </div>
  );
}
