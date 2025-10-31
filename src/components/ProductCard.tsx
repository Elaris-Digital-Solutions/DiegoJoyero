import { Product } from '../lib/supabase';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
      style={{
        backgroundColor: 'var(--cardBg)',
        border: '1px solid var(--border)',
        boxShadow: `0 4px 20px var(--shadow)`,
      }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, var(--primary), transparent)`,
            mixBlendMode: 'multiply',
          }}
        />

        {product.featured && (
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
            }}
          >
            Destacado
          </div>
        )}
      </div>

      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-xl font-serif transition-colors duration-500"
            style={{ color: 'var(--text)' }}
          >
            {product.name}
          </h3>
          <span
            className="text-xs px-2 py-1 rounded-full uppercase tracking-wide transition-colors duration-500"
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--text)',
            }}
          >
            {product.material}
          </span>
        </div>

        <p
          className="text-sm line-clamp-2 transition-colors duration-500"
          style={{ color: 'var(--textSecondary)' }}
        >
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4">
          <span
            className="text-2xl font-medium transition-colors duration-500"
            style={{ color: 'var(--primary)' }}
          >
            {formatPrice(product.price)}
          </span>

          <button
            className="p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              boxShadow: `0 4px 15px var(--glow)`,
            }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {product.stock < 5 && product.stock > 0 && (
          <p
            className="text-xs italic transition-colors duration-500"
            style={{ color: 'var(--textSecondary)' }}
          >
            Solo quedan {product.stock} unidades
          </p>
        )}
      </div>
    </div>
  );
}
