import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
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
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollManager />
  <div className="min-h-screen transition-colors duration-500 flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
          <Header onCartToggle={() => setIsCartOpen((prev) => !prev)} isCartOpen={isCartOpen} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/producto/:id" element={<ProductPage />} />
            </Routes>
          </main>
          <Footer />
          <WhatsappButton />
          <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
