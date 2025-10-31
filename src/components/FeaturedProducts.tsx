import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function FeaturedProducts() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [theme]);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('material', theme)
        .eq('featured', true)
        .order('price', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(Math.min(currentIndex + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  if (loading || products.length === 0) return null;

  return (
    <section id="featured" className="py-24 transition-colors duration-500" style={{ backgroundColor: 'var(--cardBg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--primary)' }}>
            Piezas Destacadas
          </span>
          <h2
            className="text-4xl md:text-5xl font-serif tracking-wide transition-colors duration-500"
            style={{ color: 'var(--text)' }}
          >
            {theme === 'gold' ? 'Las Más Celebradas' : 'Favoritas del Momento'}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto transition-colors duration-500"
            style={{ color: 'var(--textSecondary)' }}
          >
            {theme === 'gold'
              ? 'Nuestras joyas de oro más apreciadas, perfectas para momentos especiales'
              : 'Diseños de plata que lideran tendencias y marcan estilo'}
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0" style={{ width: `${100 / itemsPerView}%` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {products.length > itemsPerView && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--text)',
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i * itemsPerView)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: i * itemsPerView <= currentIndex && currentIndex < (i + 1) * itemsPerView ? '24px' : '8px',
                      backgroundColor: i * itemsPerView <= currentIndex && currentIndex < (i + 1) * itemsPerView ? 'var(--primary)' : 'var(--border)',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--text)',
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
