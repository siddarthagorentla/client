import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item-card" id={`cart-item-${item.id}`}>
      <div className="cart-item-left">
        <span className="cart-item-emoji">{item.emoji}</span>
        <div className="cart-item-info">
          <h3>{item.name}</h3>
          <span className="cart-item-unit-price">₹{item.price} each</span>
        </div>
      </div>
      <div className="cart-item-right">
        <div className="quantity-control">
          <button
            className="qty-btn qty-minus"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            −
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn qty-plus"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <span className="cart-item-total">₹{item.price * item.quantity}</span>
        <button
          className="btn-remove"
          onClick={() => removeFromCart(item.id)}
          title="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
