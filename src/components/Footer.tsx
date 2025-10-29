import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-dark text-pearl border-t border-gold/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-playfair text-2xl mb-4 text-gradient-gold">Lumière Joaillerie</h3>
            <p className="text-pearl/70 text-sm">
              Elegancia atemporal en cada pieza. Descubre la joyería que define tu estilo único.
            </p>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4">Contacto</h4>
            <div className="space-y-3 text-sm text-pearl/70">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <span>+34 900 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                <span>info@lumiere-joaillerie.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                <span>Madrid, España</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-pearl/70">
              <li><a href="#" className="hover:text-gold transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Colecciones</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Cuidado de Joyas</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Política de Devolución</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair text-lg mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gold/20 pt-6 text-center text-sm text-pearl/50">
          <p>© 2025 Lumière Joaillerie. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
