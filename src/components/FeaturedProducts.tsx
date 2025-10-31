import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { supabase, type Product } from '../lib/supabase';
import { Button } from './ui/button';

interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  price: string;
  image: string;
  details: string[];
  href: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);

const getYearLabel = (value: string | null | undefined) => {
  if (!value) return 'Colección vigente';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Colección vigente';

  return parsed.getFullYear().toString();
};

const buildDetails = (product: Product): string[] => {
  const availability =
    product.stock <= 0
      ? 'Disponibilidad: edición limitada agotada'
      : product.stock < 5
        ? `Disponibilidad: últimas ${product.stock} piezas`
        : 'Disponibilidad: en stock';

  const collectionLabel = product.category
    ? `Colección: ${product.category}`
    : `Colección ${product.material === 'gold' ? 'Oro' : 'Plata'}`;

  const materialLabel = product.material === 'gold' ? 'Material: oro 18k certificado' : 'Material: plata .925 certificada';

  return [materialLabel, collectionLabel, availability, `Referencia: ${product.id}`];
};

const mapProductToShowcase = (product: Product): ShowcaseItem => ({
  id: product.id,
  title: product.name,
  subtitle: product.category || (product.material === 'gold' ? 'Colección oro' : 'Colección plata'),
  year: getYearLabel(product.created_at),
  description: product.description,
  price: formatPrice(product.price),
  image:
    product.image_url ||
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=1200&fit=crop&auto=format&dpr=1',
  details: buildDetails(product),
  href: `/producto/${product.id}`,
});

export function FeaturedProducts() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('material', theme)
          .eq('featured', true)
          .order('price', { ascending: false })
          .limit(4);

        if (error) throw error;
        if (isMounted) {
          setProducts(data ?? []);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, [theme]);

  const showcaseItems = useMemo(() => products.map(mapProductToShowcase), [products]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedItem(null);
  }, [showcaseItems.length]);

  if (loading || showcaseItems.length === 0) {
    return null;
  }

  const currentItem = showcaseItems[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
  };

  return (
    <section id="featured" className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-light uppercase tracking-[0.45em] text-muted-foreground">
            Piezas destacadas · Colección {theme === 'gold' ? 'oro' : 'plata'}
          </p>
          <h2 className="mt-4 text-4xl font-light tracking-tight md:text-5xl">
            Selección exclusiva de la maison
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            Curaduría de piezas maestras trabajadas en series limitadas. Cada engaste celebra la esencia del
            {` ${theme === 'gold' ? 'oro' : 'plata'} Diego Joyero.`}
          </p>
        </motion.div>

        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative aspect-[3/4] cursor-pointer"
            onClick={() => setSelectedItem(currentItem)}
          >
            <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-primary/5 to-transparent" />
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="h-full w-full rounded-sm object-cover shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 rounded-sm bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
          </motion.div>

          <motion.div
            key={`details-${currentItem.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <p className="text-xs font-light uppercase tracking-[0.35em] text-muted-foreground">
                {currentItem.year}
              </p>
              <h3 className="text-4xl font-light tracking-tight md:text-5xl">{currentItem.title}</h3>
              <p className="text-lg font-light italic text-muted-foreground md:text-xl">{currentItem.subtitle}</p>
            </div>

            <div className="h-px w-20 bg-border/60" />

            <p className="text-base font-light leading-relaxed text-muted-foreground md:text-lg">
              {currentItem.description}
            </p>

            <div className="space-y-3">
              {currentItem.details.map((detail, index) => (
                <motion.div
                  key={detail}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <p className="text-sm font-light tracking-wide text-foreground/90">{detail}</p>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-3xl font-light tracking-wide">{currentItem.price}</p>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => setSelectedItem(currentItem)}
                variant="outline"
                className="mt-4 px-8 py-6 text-sm font-light uppercase tracking-[0.25em] transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                Ver detalles
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8">
          <Button
            type="button"
            onClick={goToPrevious}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full border border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-3">
            {showcaseItems.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(itemIndex)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  itemIndex === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-primary/60'
                }`}
                aria-label={`Ver ${item.title}`}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={goToNext}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full border border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <div className="min-h-screen px-6 py-12 md:px-12 md:py-20">
              <Button
                type="button"
                onClick={() => setSelectedItem(null)}
                variant="ghost"
                size="icon"
                className="fixed right-8 top-8 z-10 h-12 w-12 rounded-full border border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                <X className="h-5 w-5" />
              </Button>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-6xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="grid gap-12 md:grid-cols-5 md:gap-16">
                  <div className="md:col-span-3">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full rounded-sm shadow-2xl"
                      loading="lazy"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                      <p className="text-xs font-light uppercase tracking-[0.35em] text-muted-foreground">
                        {selectedItem.year}
                      </p>
                      <h3 className="text-4xl font-light tracking-tight md:text-5xl">{selectedItem.title}</h3>
                      <p className="text-lg font-light italic text-muted-foreground md:text-xl">
                        {selectedItem.subtitle}
                      </p>
                    </div>

                    <div className="h-px bg-border/50" />

                    <p className="text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                      {selectedItem.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
                        Especificaciones
                      </h4>
                      {selectedItem.details.map((detail) => (
                        <div key={detail} className="flex items-start gap-3">
                          <div className="mt-2 h-1 w-1 rounded-full bg-primary" />
                          <p className="text-sm font-light text-foreground/90">{detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <p className="text-4xl font-light tracking-wide">{selectedItem.price}</p>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                      <Button className="w-full py-6 text-sm font-light uppercase tracking-[0.25em]">
                        Solicitar información
                      </Button>
                      <Button asChild variant="outline" className="w-full py-6 text-sm uppercase tracking-[0.25em]">
                        <Link to={selectedItem.href} onClick={() => setSelectedItem(null)}>
                          Ver ficha completa
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
