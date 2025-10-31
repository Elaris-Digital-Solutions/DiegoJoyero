import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { fallbackProducts } from '../lib/fallbackProducts';
import { supabase, type Product } from '../lib/supabase';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';

type PreviewState = {
  products: Product[];
  isFallback: boolean;
};

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const gridVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const LOADING_STATE: PreviewState = { products: [], isFallback: false };

export function CollectionPreview() {
  const { theme } = useTheme();
  const [{ products, isFallback }, setPreview] = useState<PreviewState>(LOADING_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);

      const buildFallback = () => {
        const fallback = [...fallbackProducts[theme]].sort((a, b) => {
          if (a.featured === b.featured) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.featured ? -1 : 1;
        });
        return fallback.slice(0, 3);
      };

      if (!supabase) {
        setPreview({ products: buildFallback(), isFallback: true });
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('material', theme)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(6);

        if (!isMounted) return;
        if (error) throw error;

        if (data && data.length > 0) {
          setPreview({ products: data.slice(0, 3), isFallback: false });
        } else {
          setPreview({ products: buildFallback(), isFallback: true });
        }
      } catch (error) {
        console.error('Error loading collection preview:', error);
        if (!isMounted) return;
        setPreview({ products: buildFallback(), isFallback: true });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [theme]);

  const hasProducts = products.length > 0;

  const narrative = useMemo(
    () =>
      theme === 'gold'
        ? {
            eyebrow: 'Colección oro 18k',
            title: 'Destellos para el ritual cotidiano',
            description:
              'Tres piezas cuidadosamente seleccionadas para acercarte a la calidez del oro 18 quilates. Descubre la serie completa en nuestra experiencia de colecciones.',
          }
        : {
            eyebrow: 'Colección plata 925',
            title: 'Luz depurada, formas eternas',
            description:
              'Tres diseños que revelan la pureza de la plata peruana. Explora la colección completa y encuentra la pieza que dialogue con tu estilo.',
          },
    [theme]
  );

  return (
    <section id="coleccion" className="bg-background py-24 text-foreground">
      <div className="mx-auto max-w-6xl space-y-16 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={heroVariants}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">{narrative.eyebrow}</p>
          <h2 className="text-3xl font-light tracking-tight md:text-5xl">{narrative.title}</h2>
          <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {narrative.description}
          </p>
        </motion.div>

        {isFallback && (
          <p className="text-center text-[0.7rem] uppercase tracking-[0.35em] text-muted-foreground">
            Mostrando una curaduría de referencia mientras sincronizamos el catálogo.
          </p>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : hasProducts ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={gridVariants}
            transition={{ duration: 0.6 }}
            className="grid gap-12 md:grid-cols-3"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
              Próximamente nuevas piezas en esta colección.
            </p>
          </div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={heroVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center"
        >
          <Button asChild className="gap-3 uppercase tracking-[0.35em]">
            <a href="/colecciones" className="flex items-center gap-3">
              Explorar colección completa
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
