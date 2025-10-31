import { Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      <div className="backdrop-blur-md bg-white/80 border-b border-[var(--border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 transition-colors duration-500" style={{ color: 'var(--primary)' }} />
              <div>
                <h1 className="text-2xl font-serif tracking-wider transition-colors duration-500" style={{ color: 'var(--text)' }}>
                  Diego Joyero
                </h1>
                <p className="text-xs tracking-widest uppercase transition-colors duration-500" style={{ color: 'var(--textSecondary)' }}>
                  Fine Jewelry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-8">
                <a href="#collection" className="text-sm tracking-wide uppercase transition-all duration-300 hover:scale-105" style={{ color: 'var(--textSecondary)' }}>
                  Colección
                </a>
                <a href="#about" className="text-sm tracking-wide uppercase transition-all duration-300 hover:scale-105" style={{ color: 'var(--textSecondary)' }}>
                  Nosotros
                </a>
                <a href="#contact" className="text-sm tracking-wide uppercase transition-all duration-300 hover:scale-105" style={{ color: 'var(--textSecondary)' }}>
                  Contacto
                </a>
              </nav>

              <button
                onClick={toggleTheme}
                disabled={isTransitioning}
                className="relative group"
                aria-label="Toggle theme"
              >
                <div className="px-6 py-3 rounded-full border-2 transition-all duration-500 hover:scale-105 disabled:opacity-50"
                  style={{
                    borderColor: 'var(--primary)',
                    backgroundColor: 'var(--cardBg)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: theme === 'gold' ? '#D4AF37' : '#C0C0C0',
                        boxShadow: `0 0 10px var(--glow)`
                      }}
                    />
                    <span className="text-sm font-medium tracking-wider uppercase transition-colors duration-500"
                      style={{ color: 'var(--text)' }}
                    >
                      {theme === 'gold' ? 'Oro' : 'Plata'}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
