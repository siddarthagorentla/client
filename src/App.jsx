import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/done/:docId" element={<OrderConfirmed />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
