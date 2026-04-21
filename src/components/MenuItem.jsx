import { useCart } from '../context/CartContext';

export default function MenuItem({ item }) {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="menu-item-card" id={`menu-item-${item.id}`}>
      {item.popular && <span className="popular-badge">🔥 Popular</span>}
      <div className="item-emoji">{item.emoji}</div>
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        {item.nameLocal && <span className="item-name-local">{item.nameLocal}</span>}
        <p className="item-desc">{item.description}</p>
        <div className="item-footer">
          <span className="item-price">₹{item.price}</span>
          {quantity === 0 ? (
            <button
              className="btn-add"
              onClick={() => addToCart(item)}
              id={`add-${item.id}`}
            >
              + ADD
            </button>
          ) : (
            <div className="quantity-control">
              <button
                className="qty-btn qty-minus"
                onClick={() => updateQuantity(item.id, quantity - 1)}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn qty-plus"
                onClick={() => updateQuantity(item.id, quantity + 1)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
