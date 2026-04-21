import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { QRCodeSVG } from 'qrcode.react';
import OrderCard from '../components/OrderCard';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const ADMIN_PIN = '1234'; // Simple 4-digit PIN for vendor access

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'preparing', 'ready'
  const [showQR, setShowQR] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevOrderCountRef = useRef(0);
  const audioRef = useRef(null);

  // Site URL for QR code
  const siteUrl = window.location.origin;

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(docSnap => ({
        docId: docSnap.id,
        ...docSnap.data()
      }));
      
      // Play sound for new orders
      if (soundEnabled && ordersList.length > prevOrderCountRef.current && prevOrderCountRef.current > 0) {
        playNotificationSound();
      }
      prevOrderCountRef.current = ordersList.length;
      
      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const playNotificationSound = () => {
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.frequency.value = 1000;
      }, 150);
      
      setTimeout(() => {
        oscillator.frequency.value = 1200;
      }, 300);
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 450);
    } catch (e) {
      console.log('Could not play sound:', e);
    }
  };

  const markAsReady = async (docId) => {
    try {
      await updateDoc(doc(db, 'orders', docId), {
        status: 'ready',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PIN) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      setAuthError('Incorrect PIN');
      setPasscode('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return (
      <div className="page admin-page flex-center" style={{ paddingTop: '100px' }}>
        <form className="checkout-form" onSubmit={handleLogin} style={{ maxWidth: '320px', width: '100%', margin: '0 auto' }}>
          <div className="shop-badge" style={{ margin: '0 auto 20px', width: '60px', height: '60px' }}>
            <span className="badge-emoji" style={{ fontSize: '28px' }}>🔒</span>
          </div>
          <h2 className="section-title" style={{ justifyContent: 'center' }}>Admin Login</h2>
          <p className="qr-subtitle" style={{ textAlign: 'center', marginBottom: '20px' }}>Enter PIN (1234) to access panel</p>
          
          {authError && <div className="error-msg">{authError}</div>}
          
          <div className="form-group">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              maxLength={4}
              inputMode="numeric"
              autoFocus
              style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '12px', fontWeight: 'bold' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page admin-page">
        <div className="loading-state">
          <div className="pulse-loader"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page admin-page">
      <header className="admin-header">
        <div className="admin-title-row">
          <h1>🌶️ Dashboard</h1>
          <div className="admin-actions">
            <button
              className={`icon-btn ${soundEnabled ? 'active' : ''}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
            >
              {soundEnabled ? '🔔' : '🔕'}
            </button>
            <button
              className="icon-btn"
              onClick={() => setShowQR(!showQR)}
              title="Show QR Code"
            >
              📱
            </button>
            <button
              className="icon-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card stat-preparing">
            <span className="stat-number">{preparingCount}</span>
            <span className="stat-label">Preparing</span>
          </div>
          <div className="stat-card stat-ready">
            <span className="stat-number">{readyCount}</span>
            <span className="stat-label">Ready</span>
          </div>
          <div className="stat-card stat-total">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="qr-modal" onClick={() => setShowQR(false)}>
          <div className="qr-content" onClick={e => e.stopPropagation()}>
            <h2>Scan to Order</h2>
            <div className="qr-code-wrapper">
              <QRCodeSVG
                value={siteUrl}
                size={220}
                bgColor="#ffffff"
                fgColor="#1a1a2e"
                level="H"
              />
            </div>
            <p className="qr-url">{siteUrl}</p>
            <button className="btn-secondary" onClick={() => setShowQR(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({orders.length})
        </button>
        <button
          className={`filter-tab ${filter === 'preparing' ? 'active' : ''}`}
          onClick={() => setFilter('preparing')}
        >
          🔥 Preparing ({preparingCount})
        </button>
        <button
          className={`filter-tab ${filter === 'ready' ? 'active' : ''}`}
          onClick={() => setFilter('ready')}
        >
          ✅ Ready ({readyCount})
        </button>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No orders yet</h2>
            <p>Orders will appear here in real-time</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.docId}
              order={order}
              onMarkReady={markAsReady}
            />
          ))
        )}
      </div>
    </div>
  );
}
