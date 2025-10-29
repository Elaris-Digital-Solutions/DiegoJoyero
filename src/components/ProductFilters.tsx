import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  maxPrice: number;
}

export const ProductFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
}: ProductFiltersProps) => {
  const categories = ["Todos", "Anillos", "Collares", "Aretes", "Relojes", "Pulseras"];

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-elegant bg-card border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar joyas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-border/50 focus-visible:ring-gold"
          />
        </div>
      </Card>

      <Card className="p-6 shadow-elegant bg-card border-border/50">
        <h3 className="font-playfair text-lg mb-4 text-foreground">Categoría</h3>
        <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={category} id={category} className="border-gold text-gold" />
              <Label 
                htmlFor={category} 
                className="text-sm cursor-pointer hover:text-gold transition-colors"
              >
                {category}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      <Card className="p-6 shadow-elegant bg-card border-border/50">
        <h3 className="font-playfair text-lg mb-4 text-foreground">Rango de Precio</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            max={maxPrice}
            step={100}
            className="[&_[role=slider]]:bg-gold [&_[role=slider]]:border-gold"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
