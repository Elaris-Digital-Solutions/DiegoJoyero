import { type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../lib/supabase';
import { normalizeCategory } from '../lib/utils';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  variant?: 'featured' | 'catalog';
}

export function ProductCard({ product, variant = 'catalog' }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const categoryLabel = normalizeCategory(product.category) || (product.material === 'gold' ? 'Oro' : 'Plata');
  const detailPath = `/producto/${product.id}`;
  const { addItem } = useCart();
  const isAvailable = product.stock > 0;

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (!isAvailable) {
      return;
    }
    addItem(product);
  };

  return (
    <article
      className="group relative flex flex-col border"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)' }}
    >
      <div className={`relative overflow-hidden ${variant === 'featured' ? 'aspect-[3/4]' : 'aspect-square'}`}>
        <Link to={detailPath} className="block h-full">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </Link>

  <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center opacity-100 translate-y-0 transition-all duration-500 ease-out md:opacity-0 md:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="pointer-events-auto inline-flex items-center gap-3 border px-6 py-3 text-[0.58rem] uppercase tracking-[0.35em] transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              color: 'var(--text)',
              borderColor: 'var(--border)',
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isAvailable ? 'Agregar' : 'Sin stock'}</span>
          </button>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 py-4 text-[0.6rem] uppercase tracking-[0.35em]"
          style={{ color: '#FFFFFF', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)' }}
        >
          <span>{categoryLabel}</span>
          <span>{product.material === 'gold' ? 'Oro 18k' : 'Plata 925'}</span>
        </div>
      </div>

      <div className="px-6 py-8 flex flex-col gap-6">
        <div className="space-y-3">
          <Link to={detailPath} className="block">
            <h3 className="text-2xl font-display leading-snug" style={{ color: 'var(--text)' }}>
              {product.name}
            </h3>
          </Link>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
            {product.description}
          </p>
        </div>

        <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="block text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: 'var(--textSecondary)' }}>
                Inversión
              </span>
              <span className="text-[0.58rem] uppercase tracking-[0.22em]" style={{ color: 'var(--textSecondary)' }}>
                {isAvailable
                  ? product.stock < 5
                    ? `Disponibles ${product.stock}`
                    : 'Entrega inmediata'
                  : 'Agotado temporalmente'}
              </span>
            </div>
            <span className="text-base tracking-[0.18em] uppercase" style={{ color: 'var(--primary)' }}>
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <Link
          to={detailPath}
          className="inline-flex items-center justify-between w-full border px-5 py-3 text-[0.68rem] uppercase tracking-[0.4em] transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] hover:border-[var(--primary)]"
          style={{
            color: 'var(--text)',
            borderColor: 'var(--border)',
            backgroundColor: 'transparent',
          }}
        >
          <span>Detalles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
