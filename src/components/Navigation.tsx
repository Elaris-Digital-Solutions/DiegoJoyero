import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h2 className="font-playfair text-xl md:text-2xl text-foreground">Lumière</h2>
            <div className="hidden md:flex gap-6">
              <a href="#" className="text-sm text-foreground hover:text-gold transition-colors">Inicio</a>
              <a href="#coleccion" className="text-sm text-foreground hover:text-gold transition-colors">Colección</a>
              <a href="#" className="text-sm text-foreground hover:text-gold transition-colors">Sobre Nosotros</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
