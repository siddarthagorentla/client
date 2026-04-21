import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page cart-page">
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h1>Your Cart</h1>
        </header>
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items from our menu!</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Your Cart</h1>
      </header>

      <div className="cart-items">
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{totalPrice}</span>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <span className="total-price">₹{totalPrice}</span>
        </div>
      </div>

      <div className="cart-actions">
        <button className="btn-secondary" onClick={clearCart}>
          Clear Cart
        </button>
        <button className="btn-primary btn-checkout" onClick={() => navigate('/checkout')}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
