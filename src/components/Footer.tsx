import { Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className="transition-colors duration-500"
      style={{
        backgroundColor: theme === 'gold' ? '#2A2420' : '#1A2332',
        color: '#FFFFFF',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif tracking-wide mb-4">Diego Joyero</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {theme === 'gold'
                ? 'Excelencia en joyería de oro, donde cada pieza cuenta una historia.'
                : 'Diseño y elegancia en plata, expresión de tu identidad única.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold tracking-wider uppercase text-sm mb-6">Navegación</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><a href="#featured" className="hover:text-white transition-colors duration-300">Piezas Destacadas</a></li>
              <li><a href="#values" className="hover:text-white transition-colors duration-300">Nuestros Pilares</a></li>
              <li><a href="#about" className="hover:text-white transition-colors duration-300">Nuestra Historia</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors duration-300">Colección Completa</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold tracking-wider uppercase text-sm mb-6">Contacto</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center gap-2 hover:text-white transition-colors duration-300 cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span>Lima, Perú</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors duration-300 cursor-pointer">
                <Phone className="w-4 h-4" />
                <span>+51 1 2345 6789</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors duration-300 cursor-pointer">
                <Mail className="w-4 h-4" />
                <span>info@diegojoyero.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold tracking-wider uppercase text-sm mb-6">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: theme === 'gold' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 212, 255, 0.2)',
                }}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: theme === 'gold' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 212, 255, 0.2)',
                }}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t transition-colors duration-500 pt-8"
          style={{
            borderColor: theme === 'gold' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(0, 212, 255, 0.3)',
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm space-y-4 md:space-y-0">
            <p>© 2024 Diego Joyero. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors duration-300">Política de Privacidad</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Términos de Servicio</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Política de Devoluciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
