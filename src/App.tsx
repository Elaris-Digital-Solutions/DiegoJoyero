import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Values } from './components/Values';
import { Story } from './components/Story';
import { Guarantees } from './components/Guarantees';
import { ProductCatalog } from './components/ProductCatalog';
import { Footer } from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--background)' }}>
        <Header />
        <Hero />
        <FeaturedProducts />
        <Values />
        <Story />
        <Guarantees />
        <ProductCatalog />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
