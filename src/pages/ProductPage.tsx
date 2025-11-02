import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { supabase, Product } from '../lib/supabase';
import { fallbackProducts } from '../lib/fallbackProducts';
import { useCart } from '../contexts/CartContext';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], when: 'beforeChildren', staggerChildren: 0.18 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } },
};

const detailsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  const findFallbackProduct = (productId: string | undefined) => {
    if (!productId) return null;
    for (const collection of Object.values(fallbackProducts)) {
      const candidate = collection.find((item) => item.id === productId);
      if (candidate) {
        return candidate;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      if (!supabase) {
        const fallbackProduct = findFallbackProduct(id);
        if (fallbackProduct) {
          setProduct(fallbackProduct);
        } else {
          setProduct(null);
          setError('No se pudo obtener la información de la pieza.');
        }
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error al obtener la pieza desde Supabase:', fetchError);
      }

      if (fetchError || !data) {
        const fallbackProduct = findFallbackProduct(id);
        if (fallbackProduct) {
          setProduct(fallbackProduct);
          setError(null);
        } else {
          setProduct(null);
          setError('No se pudo obtener la información de la pieza.');
        }
        setLoading(false);
        return;
      }

      const fallbackProduct = findFallbackProduct(id);
      const resolvedProduct = fallbackProduct
        ? {
            ...fallbackProduct,
            ...data,
            description: data.description || fallbackProduct.description,
            image_url: data.image_url || fallbackProduct.image_url,
          }
        : data;

      setProduct(resolvedProduct);
      setError(null);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const categoryLabel = useMemo(() => {
    if (!product) return '';
    return product.category || (product.material === 'gold' ? 'Oro' : 'Plata');
  }, [product]);

  const formattedPrice = useMemo(() => {
    if (!product) return '';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(product.price);
  }, [product]);

  if (loading) {
    return (
      <motion.section className="py-24" initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
            Cargando pieza
          </p>
        </div>
      </motion.section>
    );
  }

  if (error || !product) {
    return (
      <motion.section className="py-24" initial="hidden" animate="visible" variants={sectionVariants}>
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
            {error ?? 'Esta pieza no está disponible.'}
          </p>
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.45em] border-b border-transparent hover:border-[var(--primary)]"
            style={{ color: 'var(--primary)' }}
          >
            Volver a la colección
          </Link>
        </div>
      </motion.section>
    );
  }

  const isAvailable = (product?.stock ?? 0) > 0;

  const handleAddToCart = () => {
    if (!product || !isAvailable) return;
    addItem(product);
  };

  return (
    <motion.section
      className="py-16 md:py-24"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-[1.1fr,1fr] items-start">
        <motion.figure
          className="w-full h-[480px] md:h-[620px] border"
          style={{ borderColor: 'var(--border)' }}
          variants={imageVariants}
        >
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </motion.figure>

        <motion.div className="flex flex-col gap-10" variants={detailsVariants}>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.5em]" style={{ color: 'var(--textSecondary)' }}>
              {categoryLabel}
            </span>
            <h1 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--text)' }}>
              {product.name}
            </h1>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.45em]" style={{ color: 'var(--textSecondary)' }}>
                  Material
                </span>
                <p className="text-sm uppercase tracking-[0.3em]" style={{ color: 'var(--text)' }}>
                  {product.material === 'gold' ? 'Oro 18k' : 'Plata 925'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-[0.45em]" style={{ color: 'var(--textSecondary)' }}>
                  Inversión
                </span>
                <p className="text-base tracking-[0.3em] uppercase" style={{ color: 'var(--primary)' }}>
                  {formattedPrice}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs uppercase tracking-[0.35em]" style={{ color: 'var(--textSecondary)' }}>
              <p>Disponibilidad: {product.stock > 0 ? `Quedan ${product.stock} unidades` : 'Agotado'}</p>
              <p>Entrega estimada: 10 - 12 días hábiles</p>
              <p>Cuidado: limpieza anual en cortesía</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-xs uppercase tracking-[0.45em]">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="border-b border-transparent transition-colors duration-300 hover:border-[var(--primary)] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ color: 'var(--primary)' }}
            >
              {isAvailable ? 'Agregar al carrito' : 'Sin stock' }
            </button>
            <Link
              to="/"
              className="border-b border-transparent hover:border-[var(--primary)]"
              style={{ color: 'var(--text)' }}
            >
              Volver a la colección
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
