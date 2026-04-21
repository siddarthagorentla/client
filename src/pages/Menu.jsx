import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { menuItems } from '../data/menuItems';
import MenuItem from '../components/MenuItem';
import StickyCartButton from '../components/StickyCartButton';
import { QRCodeSVG } from 'qrcode.react';

export default function Menu() {
  const [showQR, setShowQR] = useState(false);
  const siteUrl = window.location.origin;

  return (
    <div className="page menu-page">
      {/* Header */}
      <header className="menu-header">
        <div className="header-glow"></div>
        {/* Share QR button */}
        <button
          className="share-qr-btn"
          onClick={() => setShowQR(true)}
          title="Share QR Code"
          id="menu-share-qr"
        >
          📱 Share
        </button>
        <div className="shop-badge">
          <span className="badge-emoji">🌶️</span>
        </div>
        <h1 className="shop-name">Mirchi Bajji Shop</h1>
        <p className="shop-tagline">Fresh • Hot • Crispy</p>
        <div className="header-divider">
          <span className="divider-dot"></span>
          <span className="divider-line"></span>
          <span className="divider-dot"></span>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="qr-modal" onClick={() => setShowQR(false)}>
          <div className="qr-content" onClick={e => e.stopPropagation()}>
            <h2>Scan to Order</h2>
            <p className="qr-subtitle">Share this QR with friends & family!</p>
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

      {/* Menu Section */}
      <section className="menu-section">
        <h2 className="section-title">
          <span className="title-icon">📋</span>
          Our Menu
        </h2>
        <div className="menu-grid">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Sticky Cart Button */}
      <StickyCartButton />
    </div>
  );
}
