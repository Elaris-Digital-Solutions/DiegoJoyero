import { Product, ProductCard } from "./ProductCard";
import productRing from "@/assets/product-ring-1.jpg";
import productNecklace from "@/assets/product-necklace-1.jpg";
import productEarrings from "@/assets/product-earrings-1.jpg";

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Anillo Solitario Eternité",
    price: 3500,
    category: "Anillos",
    image: productRing,
    description: "Elegante anillo solitario con diamante de corte brillante en oro de 18k.",
    featured: true,
  },
  {
    id: 2,
    name: "Collar Lumière Pendant",
    price: 2800,
    category: "Collares",
    image: productNecklace,
    description: "Delicado collar con colgante circular en oro amarillo de 18k.",
    featured: true,
  },
  {
    id: 3,
    name: "Aretes Perla Clásica",
    price: 4200,
    category: "Aretes",
    image: productEarrings,
    description: "Aretes con perlas cultivadas y engaste en oro de 18k.",
    featured: true,
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gradient-elegant">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-4">
            Piezas Destacadas
          </h2>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      </div>
    </section>
  );
};
