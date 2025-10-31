import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
  variant?: 'featured' | 'catalog';
}

export function ProductCard({ product, variant = 'catalog' }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const categoryLabel = product.category || (product.material === 'gold' ? 'Oro' : 'Plata');
  const detailPath = `/producto/${product.id}`;

  return (
    <article
      className="group relative flex flex-col border"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)' }}
    >
      <Link to={detailPath} className={`relative overflow-hidden block ${variant === 'featured' ? 'aspect-[3/4]' : 'aspect-square'}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-4 text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: '#FFFFFF', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)' }}>
          <span>{categoryLabel}</span>
          <span>{product.material === 'gold' ? 'Oro 18k' : 'Plata 925'}</span>
        </div>
      </Link>

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

        <div className="flex items-start justify-between gap-8 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
          <div className="space-y-1">
            <span className="text-[0.65rem] uppercase tracking-[0.35em]" style={{ color: 'var(--textSecondary)' }}>
              Inversión
            </span>
            <span className="text-base tracking-[0.3em] uppercase" style={{ color: 'var(--primary)' }}>
              {formatPrice(product.price)}
            </span>
          </div>

          {product.stock > 0 ? (
            <span className="text-[0.6rem] uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
              {product.stock < 5 ? `Últimas ${product.stock}` : 'Disponible'}
            </span>
          ) : (
            <span className="text-[0.6rem] uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
              Agotado temporalmente
            </span>
          )}
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
