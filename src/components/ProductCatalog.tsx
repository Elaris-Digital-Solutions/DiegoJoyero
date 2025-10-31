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
    <section id="collection" className="py-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-display" style={{ color: 'var(--text)' }}>
            Colección {theme === 'gold' ? 'Oro' : 'Plata'}
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
            {theme === 'gold'
              ? 'Una selección de piezas elaboradas con oro 18 quilates procedente de fuentes responsables.'
              : 'Diseños depurados en plata 925 que celebran la precisión y la luz del metal.'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-[0.75rem] uppercase tracking-[0.45em]">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`pb-1 border-b transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--textSecondary)',
                  borderColor: isActive ? 'var(--primary)' : 'transparent',
                }}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
              No hay piezas disponibles en esta categoría por el momento
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
