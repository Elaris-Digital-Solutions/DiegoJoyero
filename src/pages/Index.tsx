import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ProductCard, Product } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react";
import productRing from "@/assets/product-ring-1.jpg";
import productNecklace from "@/assets/product-necklace-1.jpg";
import productEarrings from "@/assets/product-earrings-1.jpg";

const allProducts: Product[] = [
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
  },
  {
    id: 3,
    name: "Aretes Perla Clásica",
    price: 4200,
    category: "Aretes",
    image: productEarrings,
    description: "Aretes con perlas cultivadas y engaste en oro de 18k.",
  },
  {
    id: 4,
    name: "Anillo Compromiso Royale",
    price: 5800,
    category: "Anillos",
    image: productRing,
    description: "Anillo de compromiso con diamante central y pavé lateral en platino.",
  },
  {
    id: 5,
    name: "Collar Cadena Elegancia",
    price: 1950,
    category: "Collares",
    image: productNecklace,
    description: "Cadena minimalista en oro blanco de 18k con acabado pulido.",
  },
  {
    id: 6,
    name: "Aretes Diamante Stud",
    price: 3200,
    category: "Aretes",
    image: productEarrings,
    description: "Aretes tipo stud con diamantes de 0.50ct cada uno en oro blanco.",
  },
  {
    id: 7,
    name: "Pulsera Tennis Lujo",
    price: 6500,
    category: "Pulseras",
    image: productNecklace,
    description: "Pulsera tennis con diamantes en línea, montados en oro blanco de 18k.",
  },
  {
    id: 8,
    name: "Reloj Classic Gold",
    price: 8900,
    category: "Relojes",
    image: productRing,
    description: "Reloj suizo de lujo con caja en oro amarillo y correa de cuero.",
  },
];

const Index = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const maxPrice = Math.max(...allProducts.map(p => p.price));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const cycleSortBy = () => {
    const sortOrder: Array<'price-asc' | 'price-desc' | 'name'> = ['name', 'price-asc', 'price-desc'];
    const currentIndex = sortOrder.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOrder.length;
    setSortBy(sortOrder[nextIndex]);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price-asc': return 'Precio: Menor a Mayor';
      case 'price-desc': return 'Precio: Mayor a Menor';
      case 'name': return 'Nombre';
      default: return 'Ordenar';
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedProducts />
      
      <section id="coleccion" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl text-foreground mb-4">
              Nuestra Colección
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <ProductFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                maxPrice={maxPrice}
              />
              <Newsletter />
            </aside>

            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-muted-foreground">
                  {filteredAndSortedProducts.length} productos encontrados
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cycleSortBy}
                    className="border-border/50"
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {getSortLabel()}
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? '' : 'border-border/50'}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? '' : 'border-border/50'}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
                  : "space-y-6"
              }>
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>

              {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No se encontraron productos con los filtros seleccionados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
