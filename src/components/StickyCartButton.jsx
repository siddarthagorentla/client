import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function StickyCartButton() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <div className="sticky-cart-wrapper">
      <button
        className="sticky-cart-btn"
        onClick={() => navigate('/cart')}
        id="sticky-cart-button"
      >
        <div className="cart-btn-left">
          <span className="cart-badge">{totalItems}</span>
          <span className="cart-btn-text">
            {totalItems === 1 ? '1 item' : `${totalItems} items`} added
          </span>
        </div>
        <div className="cart-btn-right">
          <span className="cart-btn-price">₹{totalPrice}</span>
          <span className="cart-btn-arrow">→</span>
        </div>
      </button>
    </div>
  );
}
