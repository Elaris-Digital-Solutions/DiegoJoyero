import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const { theme, isTransitioning } = useTheme();

  return (
    <section className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <div
        className={`absolute inset-0 transition-all duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundColor: theme === 'gold' ? 'rgba(253, 246, 230, 0.85)' : 'rgba(240, 244, 248, 0.88)',
        }}
      />

      {isTransitioning && (
        <div className="absolute inset-0 z-10">
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: theme === 'silver'
                ? 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      )}

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="space-y-6 animate-fade-up">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-wide transition-all duration-700 leading-tight"
            style={{
              color: 'var(--text)',
              textShadow: `0 2px 20px rgba(0,0,0,0.1)`,
            }}
          >
            {theme === 'gold' ? 'Elegancia Atemporal' : 'Diseño Contemporáneo'}
          </h1>

          <p
            className="text-lg md:text-2xl tracking-wide max-w-3xl mx-auto transition-all duration-700 font-light"
            style={{ color: 'var(--textSecondary)' }}
          >
            {theme === 'gold'
              ? 'Descubre la belleza eterna de cada pieza, elaborada con precisión y pasión'
              : 'Explora joyas modernas que expresan tu identidad y estilo único'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <a
              href="#featured"
              className="group px-8 py-4 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                boxShadow: `0 15px 40px var(--shadow)`,
              }}
            >
              <span className="text-sm font-medium tracking-wider uppercase">
                Ver Catálogo
              </span>
            </a>

            <a
              href="#values"
              className="px-8 py-4 rounded-full border-2 transition-all duration-500 hover:scale-105"
              style={{
                borderColor: 'var(--primary)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
              }}
            >
              <span className="text-sm font-medium tracking-wider uppercase">
                Conocer Más
              </span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown
            className="w-8 h-8"
            style={{ color: 'var(--primary)' }}
          />
        </div>
      </div>
    </section>
  );
}
