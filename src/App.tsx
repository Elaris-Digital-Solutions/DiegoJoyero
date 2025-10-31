import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { ColeccionesPage } from './pages/Colecciones';
import { NosotrosPage } from './pages/Nosotros';
import { ContactoPage } from './pages/Contacto';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CartDrawer } from './components/CartDrawer';
import { WhatsappButton } from './components/WhatsappButton';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollManager />
          <div
            className="min-h-screen flex flex-col transition-colors duration-500"
            style={{ backgroundColor: 'var(--background)' }}
          >
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/colecciones" element={<ColeccionesPage />} />
                <Route path="/nosotros" element={<NosotrosPage />} />
                <Route path="/contacto" element={<ContactoPage />} />
                <Route path="/producto/:id" element={<ProductPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
              </Routes>
            </main>
            <Footer />
            <WhatsappButton />
            <CartDrawer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
