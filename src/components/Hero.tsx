import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-main.jpg";

export const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-pearl mb-6 animate-fade-in">
          Lumière Joaillerie
        </h1>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
        <p className="font-inter text-lg md:text-xl text-pearl/90 mb-8 max-w-2xl mx-auto">
          La elegancia no se compra, se descubre. Descubre tu brillo.
        </p>
        <Button 
          variant="hero" 
          size="lg"
          className="font-inter tracking-wider uppercase"
          onClick={() => document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explorar Colección
        </Button>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-pearl/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-gold rounded-full" />
        </div>
      </div>
    </section>
  );
};
