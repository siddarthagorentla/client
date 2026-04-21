export default function OrderCard({ order, onMarkReady }) {
  const isPreparing = order.status === 'preparing';
  const isReady = order.status === 'ready';

  const formatTime = (timestamp) => {
    if (!timestamp) return '--';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`order-card ${isReady ? 'order-ready' : 'order-preparing'}`} id={`order-${order.orderId}`}>
      <div className="order-card-header">
        <div className="order-card-id">
          <span className="order-hash">{order.orderId}</span>
          <span className="order-time">{formatTime(order.createdAt)}</span>
        </div>
        <span className={`status-pill ${isReady ? 'pill-ready' : 'pill-preparing'}`}>
          {isReady ? '✅ Ready' : '🔥 Preparing'}
        </span>
      </div>

      <div className="order-card-customer">
        <span>👤 {order.customerName}</span>
        <a href={`tel:${order.customerPhone}`} className="phone-link">
          📞 {order.customerPhone}
        </a>
      </div>

      <div className="order-card-items">
        {order.items?.map((item, i) => (
          <div key={i} className="order-card-item">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <span className="order-card-total">Total: ₹{order.totalPrice}</span>
        {isPreparing && (
          <button
            className="btn-ready"
            onClick={() => onMarkReady(order.docId)}
          >
            ✅ Mark Ready
          </button>
        )}
        {isReady && (
          <a
            href={`https://wa.me/91${order.customerPhone}?text=Hi ${encodeURIComponent(order.customerName)}! Your order ${order.orderId} is READY for pickup at Mirchi Bajji Shop! 🌶️`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            📱 WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
