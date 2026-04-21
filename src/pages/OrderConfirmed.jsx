import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function OrderConfirmed() {
  const { docId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId') || '';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!docId) return;

    const fetchOrder = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'orders', docId));
        if (docSnap.exists()) {
          setOrder(docSnap.data());
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [docId]);

  if (loading) {
    return (
      <div className="page done-page">
        <div className="loading-state">
          <div className="pulse-loader"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page done-page">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                backgroundColor: ['#ff6b35', '#ffb627', '#22c55e', '#f0f0f5', '#ef4444'][i % 5]
              }}
            />
          ))}
        </div>
      )}

      {/* Success Card */}
      <div className="done-card">
        <div className="done-checkmark">
          <div className="checkmark-circle">
            <svg className="checkmark-svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>

        <h1 className="done-title">Order Successful! 🎉</h1>
        <p className="done-subtitle">Your food is being prepared fresh</p>

        {/* Order ID / Token */}
        <div className="done-order-id">
          <span className="done-id-label">Your Token Number</span>
          <span className="done-id-value">{order?.orderId || orderId}</span>
        </div>

        {/* Order Items */}
        {order && (
          <div className="done-summary">
            {order.items?.map((item, i) => (
              <div key={i} className="done-item">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="done-total">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>
        )}

        {/* Info Message */}
        <div className="done-info">
          <span className="done-info-icon">📢</span>
          <p>Please wait, we'll call your token number when your order is <strong>ready for pickup!</strong></p>
        </div>
      </div>

      {/* Order Again Button */}
      <div className="done-actions">
        <button
          className="btn-primary btn-track"
          onClick={() => navigate('/')}
        >
          🌶️ Order More Items
        </button>
      </div>
    </div>
  );
}
