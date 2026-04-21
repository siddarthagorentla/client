import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Using useEffect so we don't navigate during render
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/');
    }
  }, [items.length, navigate, isSuccess]);

  if (items.length === 0 && !isSuccess) {
    return null;
  }

  const generateOrderId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'MB-';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const orderId = generateOrderId();
      const orderData = {
        orderId,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice,
        status: 'preparing',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add a timeout so the request doesn't hang forever
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(
          'Connection timed out after 15 seconds. Please check:\n' +
          '1. Firestore Database is CREATED in Firebase Console\n' +
          '2. Security Rules allow writes (test mode)\n' +
          '3. Your internet connection is working'
        )), 15000)
      );

      const docRef = await Promise.race([
        addDoc(collection(db, 'orders'), orderData),
        timeoutPromise
      ]);

      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate(`/done/${docRef.id}?orderId=${orderId}`);
      }, 0);
    } catch (err) {
      console.error('Error placing order:', err);
      // Show detailed error to help diagnose
      const errorMsg = err.code
        ? `Firebase Error: ${err.code} — ${err.message}`
        : err.message || 'Failed to place order. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page checkout-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/cart')}>
          ← Back
        </button>
        <h1>Checkout</h1>
      </header>

      {/* Order Summary */}
      <div className="checkout-summary">
        <h2 className="section-subtitle">Order Summary</h2>
        {items.map(item => (
          <div key={item.id} className="checkout-item">
            <span className="checkout-item-name">
              {item.emoji} {item.name} × {item.quantity}
            </span>
            <span className="checkout-item-price">₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="checkout-total">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      {/* Customer Details Form */}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2 className="section-subtitle">Your Details</h2>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label htmlFor="customer-name">Name</label>
          <input
            id="customer-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer-phone">Phone Number</label>
          <input
            id="customer-phone"
            type="tel"
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            disabled={loading}
            autoComplete="tel"
          />
        </div>

        <button
          type="submit"
          className="btn-primary btn-place-order"
          disabled={loading}
        >
          {loading ? (
            <span className="loading-spinner">⏳ Placing Order...</span>
          ) : (
            <>🛒 Place Order • ₹{totalPrice}</>
          )}
        </button>
      </form>
    </div>
  );
}
