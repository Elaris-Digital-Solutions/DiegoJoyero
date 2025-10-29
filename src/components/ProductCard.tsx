import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden shadow-elegant hover:shadow-gold transition-elegant bg-card border-border/50">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="md:w-1/3">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-64 md:h-48 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-playfair text-2xl text-foreground mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</p>
                </div>
                <span className="font-playfair text-2xl text-gold">${product.price.toLocaleString()}</span>
              </div>
              <p className="text-muted-foreground mt-3">{product.description}</p>
            </div>
            <Button variant="luxury" size="lg" className="mt-4 w-full md:w-auto">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Añadir al Carrito
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden shadow-elegant hover:shadow-gold transition-elegant bg-card border-border/50">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.featured && (
          <div className="absolute top-4 right-4 bg-gold text-primary px-3 py-1 text-xs uppercase tracking-wider font-inter font-medium">
            Destacado
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-playfair text-xl text-foreground mb-1 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</p>
          </div>
          <span className="font-playfair text-xl text-gold ml-4">${product.price.toLocaleString()}</span>
        </div>
        <p className="text-muted-foreground text-sm mt-3 line-clamp-2">{product.description}</p>
        <Button variant="luxury" size="lg" className="w-full mt-4">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Añadir al Carrito
        </Button>
      </div>
    </Card>
  );
};
