import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { ProductCard } from './ProductCard';
import { Loader2 } from 'lucide-react';

export function ProductCatalog() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, [theme]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('material', theme)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="collection" className="py-24 transition-colors duration-500" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2
            className="text-5xl md:text-6xl font-serif tracking-wide transition-colors duration-500"
            style={{ color: 'var(--text)' }}
          >
            Colección {theme === 'gold' ? 'Oro' : 'Plata'}
          </h2>
          <p
            className="text-lg tracking-wide max-w-2xl mx-auto transition-colors duration-500"
            style={{ color: 'var(--textSecondary)' }}
          >
            {theme === 'gold'
              ? 'Descubre piezas exclusivas de oro que celebran momentos especiales'
              : 'Explora diseños modernos de plata que expresan tu personalidad'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: selectedCategory === category ? 'var(--primary)' : 'var(--cardBg)',
                color: selectedCategory === category ? '#FFFFFF' : 'var(--text)',
                border: `1px solid ${selectedCategory === category ? 'var(--primary)' : 'var(--border)'}`,
              }}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl" style={{ color: 'var(--textSecondary)' }}>
              No hay productos disponibles en esta categoría
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
