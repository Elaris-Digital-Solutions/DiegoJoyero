import { type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../lib/supabase';
import { normalizeCategory } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProductCardProps {
  product: Product;
  variant?: 'featured' | 'catalog' | 'collectionsMinimal';
}

export function ProductCard({ product, variant = 'catalog' }: ProductCardProps) {
  const { theme } = useTheme();
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
    <article className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-xl transition-all duration-500">
      {/* Product Image */}
      <div className={`relative overflow-hidden ${variant === 'featured' ? 'aspect-[3/4]' : 'aspect-square'}`}>
        <Link to={detailPath} className="block h-full">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Featured Badge */}
        {product.featured && (
          <div className={`absolute top-4 left-4 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium uppercase tracking-[0.2em] border ${
            theme === 'gold' 
              ? 'bg-amber-500/90 text-white border-amber-400/50' 
              : 'bg-slate-500/90 text-white border-slate-400/50'
          }`}>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Destacado
            </div>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-4 right-4">
          {!isAvailable && (
            <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-[0.2em] border border-white/20">
              Agotado
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="flex-1 flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-black py-3 px-4 rounded-xl font-medium text-sm transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-4 w-4" />
            {isAvailable ? 'Agregar' : 'Sin Stock'}
          </button>
          
          <Link
            to={detailPath}
            className={`flex items-center justify-center backdrop-blur-sm py-3 px-4 rounded-xl transition-all ${
              theme === 'gold' 
                ? 'bg-amber-500/95 hover:bg-amber-500 text-white' 
                : 'bg-slate-600/95 hover:bg-slate-600 text-white'
            }`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category and Material Info */}
        <div className="absolute bottom-4 left-4 right-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium">
            <span className={`backdrop-blur-sm px-2 py-1 rounded border ${
              theme === 'gold' 
                ? 'bg-amber-900/60 border-amber-400/30' 
                : 'bg-slate-900/60 border-slate-400/30'
            }`}>
              {categoryLabel}
            </span>
            <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
              {product.material === 'gold' ? 'Oro 18k' : 'Plata 925'}
            </span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Link to={detailPath} className="block group-hover:text-primary transition-colors">
            <h3 className="text-xl font-light tracking-tight leading-tight line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price and Stock Info */}
        <div className="flex items-end justify-between pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Inversión
            </p>
            <p className="text-2xl font-light tracking-tight text-primary">
              {formatPrice(product.price)}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {isAvailable
                ? product.stock < 5
                  ? 'Pocas unidades'
                  : 'Disponible'
                : 'Agotado'}
            </p>
            {isAvailable && product.stock < 5 && (
              <p className="text-xs text-muted-foreground/70 mt-1">
                Solo {product.stock} en stock
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
