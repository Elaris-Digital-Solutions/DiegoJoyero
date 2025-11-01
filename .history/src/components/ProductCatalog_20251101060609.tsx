import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Clock3, Grid3X3, List, Loader2, Search, Sparkles, Star, X } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { fallbackProducts } from '../lib/fallbackProducts';
import { supabase, type Product } from '../lib/supabase';
import { normalizeCategory } from '../lib/utils';
import { ProductCard } from './ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'popularity' | 'newest';
type ViewMode = 'grid' | 'list';

const staticCategories = ['Anillos', 'Aros', 'Broches', 'Cadenas', 'Dijes', 'Sets'];

const panelVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const productVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const filterVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

const sortConfigurations: Array<{
  value: SortOption;
  label: string;
  description: string;
  icon: typeof Star;
}> = [
  {
    value: 'featured',
    label: 'Curaduría',
    description: 'Selección destacada de la maison',
    icon: Sparkles,
  },
  {
    value: 'price-asc',
    label: 'Menor precio',
    description: 'Inversión ascendente',
    icon: ArrowDownWideNarrow,
  },
  {
    value: 'price-desc',
    label: 'Mayor precio',
    description: 'Inversión descendente',
    icon: ArrowUpWideNarrow,
  },
  {
    value: 'popularity',
    label: 'Popularidad',
    description: 'Preferidos por nuestros clientes',
    icon: Star,
  },
  {
    value: 'newest',
    label: 'Nuevas piezas',
    description: 'Incorporaciones recientes',
    icon: Clock3,
  },
];

function getPopularityScore(product: Product) {
  const featuredBoost = product.featured ? 1000 : 0;
  const stockSignal = Math.min(product.stock ?? 0, 12) * 12;
  const recencyDays = Math.max(0, (Date.now() - new Date(product.created_at).getTime()) / 86400000);
  const recencyBoost = Math.max(0, 365 - recencyDays);
  return featuredBoost + stockSignal + recencyBoost;
}

export function ProductCatalog() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setIsUsingFallback(false);

      if (!supabase) {
        setProducts(fallbackProducts[theme]);
        setIsUsingFallback(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('material', theme)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (!isMounted) return;
        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts[theme]);
          setIsUsingFallback(true);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (!isMounted) return;
        setProducts(fallbackProducts[theme]);
        setIsUsingFallback(true);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();
    setSelectedCategory('all');
    setSortOption('featured');

    return () => {
      isMounted = false;
    };
  }, [theme]);

  const categories = useMemo(() => {
    const available = new Set<string>();

    products.forEach((product) => {
      const value = normalizeCategory(product.category);
      available.add(value);
    });

    const curated = staticCategories.filter((category) => available.has(category));
    const extras = Array.from(available).filter((category) => !staticCategories.includes(category));

    return ['all', ...curated, ...extras];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }

    return products.filter((product) => normalizeCategory(product.category) === selectedCategory);
  }, [products, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortOption) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'popularity':
        return list.sort((a, b) => getPopularityScore(b) - getPopularityScore(a));
      case 'featured':
      default:
        return list.sort((a, b) => {
          if (a.featured === b.featured) {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          }
          return a.featured ? -1 : 1;
        });
    }
  }, [filteredProducts, sortOption]);

  return (
    <section id="collection" className="py-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-6xl space-y-16 px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={panelVariants}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
            Colección {theme === 'gold' ? 'Oro' : 'Plata'}
          </p>
          <h2 className="text-3xl font-light tracking-tight md:text-5xl">Explora nuestras colecciones</h2>
          <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            Donde la forma se encuentra con la eternidad. Cada pieza está diseñada para reflejar la esencia atemporal del lujo y
            acompañarte en cada ritual personal.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[280px,1fr]">
          <motion.aside
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={panelVariants}
            transition={{ duration: 0.6 }}
            className="space-y-10 rounded-xl border p-8"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)' }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                <Filter className="h-4 w-4" />
                Filtrar por categoría
              </div>
              <div className="grid gap-3 text-[0.7rem] uppercase tracking-[0.35em]">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center justify-between rounded-md border px-4 py-3 transition-colors ${
                        isActive ? 'bg-[var(--primary)]/10' : 'bg-transparent hover:bg-[var(--primary)]/5'
                      }`}
                      style={{ borderColor: isActive ? 'var(--primary)' : 'var(--border)', color: 'var(--textSecondary)' }}
                    >
                      <span>{category === 'all' ? 'Todas las piezas' : category}</span>
                      {isActive && <span style={{ color: 'var(--primary)' }}>●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Ordenar catálogo
              </p>
              <div className="grid gap-3">
                {sortConfigurations.map(({ value, label, description, icon: Icon }) => {
                  const isActive = sortOption === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setSortOption(value)}
                      className={`flex items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all ${
                        isActive ? 'bg-[var(--primary)]/10' : 'hover:bg-[var(--primary)]/5'
                      }`}
                      style={{ borderColor: isActive ? 'var(--primary)' : 'var(--border)' }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: 'var(--border)' }}>
                        <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.45em]" style={{ color: 'var(--text)' }}>
                          {label}
                        </p>
                        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">{description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={panelVariants}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-10"
          >
            {isUsingFallback && (
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Mostrando una curaduría de referencia mientras sincronizamos el catálogo en línea.
              </p>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--primary)' }} />
              </div>
            ) : (
              <motion.div layout className="grid gap-12 sm:grid-cols-2 xl:grid-cols-3">
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={productVariants}
                    transition={{ duration: 0.55 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && sortedProducts.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
                  No hay piezas disponibles en esta selección por el momento.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
