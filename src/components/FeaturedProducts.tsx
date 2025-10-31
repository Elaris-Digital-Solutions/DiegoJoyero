import { useState, useEffect, useMemo } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
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
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const highlighted = useMemo(() => products.slice(0, 3), [products]);

  if (loading || highlighted.length === 0) return null;

  return (
    <section id="featured" className="py-24" style={{ backgroundColor: 'var(--cardBg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.5em]" style={{ color: 'var(--primary)' }}>
            Piezas destacadas
          </span>
          <h2 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--text)' }}>
            Selección de la maison
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
            Curaduría de piezas icónicas trabajadas en series limitadas. El refinamiento de cada engaste
            revela la esencia del {theme === 'gold' ? 'oro' : 'plata'} Diego Joyero.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {highlighted.map((product) => (
            <ProductCard key={product.id} product={product} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}
