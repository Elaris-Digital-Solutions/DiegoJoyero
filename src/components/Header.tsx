import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onCartToggle: () => void;
  isCartOpen: boolean;
}

const navItems = [
  { label: 'Colección', to: '/#collection' },
  { label: 'Pilares', to: '/#values' },
  { label: 'Historia', to: '/#about' },
  { label: 'Garantía', to: '/#guarantees' },
  { label: 'Contacto', to: '/#contact' },
];

export function Header({ onCartToggle, isCartOpen }: HeaderProps) {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [isCompact, setIsCompact] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<number>();
  const isAnimatingRef = useRef(false);
  const isCompactRef = useRef(false);

  const currentModeLabel = useMemo(() => (theme === 'gold' ? 'Catálogo Oro' : 'Catálogo Plata'), [theme]);
  const switchLabel = useMemo(() => (theme === 'gold' ? 'Cambiar a Plata' : 'Cambiar a Oro'), [theme]);

  const startAnimation = useCallback(
    (direction: 'compact' | 'expanded') => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = undefined;
      }

      setIsAnimating(true);
      isAnimatingRef.current = true;
      setIsCompact(direction === 'compact');
      isCompactRef.current = direction === 'compact';

      animationTimeoutRef.current = window.setTimeout(() => {
        animationTimeoutRef.current = undefined;
        setIsAnimating(false);
        isAnimatingRef.current = false;

        if (direction === 'compact' && window.scrollY === 0) {
          startAnimation('expanded');
        } else if (direction === 'expanded' && window.scrollY > 0) {
          startAnimation('compact');
        }
      }, 700);
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (isAnimatingRef.current) {
        return;
      }

      if (currentScroll > 0 && !isCompactRef.current) {
        startAnimation('compact');
      } else if (currentScroll <= 0 && isCompactRef.current) {
        startAnimation('expanded');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [startAnimation]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    isCompactRef.current = isCompact;
  }, [isCompact]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
        isCompact ? 'backdrop-blur-[6px] shadow-sm' : ''
      }`}
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
    >
      <div
        className={`max-w-6xl mx-auto px-6 transition-all duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
          isCompact ? 'py-4' : 'pt-12 pb-10 md:pt-16 md:pb-14'
        }`}
      >
        {!isCompact ? (
          <div className="flex flex-col items-center gap-10">
            <div className="flex w-full items-center justify-between text-[0.68rem] uppercase tracking-[0.4em]">
              <span className="hidden md:block" style={{ color: 'var(--textSecondary)' }}>
                Casa de Alta Joyería
              </span>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={onCartToggle}
                  className="flex items-center gap-3 border-b focus:outline-none hover:border-[var(--primary)] transition-colors duration-300"
                  style={{
                    color: 'var(--text)',
                    borderColor: isCartOpen ? 'var(--primary)' : 'transparent',
                  }}
                  aria-label="Ver carrito"
                  aria-expanded={isCartOpen}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-[0.62rem] uppercase tracking-[0.35em]">Carrito</span>
                </button>

                <div className="flex flex-col items-end text-right">
                  <span className="uppercase tracking-[0.4em] text-[0.68rem]" style={{ color: 'var(--textSecondary)' }}>
                    {currentModeLabel}
                  </span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    disabled={isTransitioning}
                    className="uppercase tracking-[0.4em] text-[0.62rem] disabled:opacity-60"
                    style={{ color: 'var(--primary)' }}
                  >
                    {switchLabel}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-center transition-transform duration-500">
              <Link to="/" className="block">
                  <img
                    src="/assets/Asset-1.svg"
                    alt="Logo Diego Joyero"
                    className="w-44 md:w-56 transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                  />
              </Link>
              <p className="text-xs uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
                Diego Joyero · Lima 1986
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-8 text-[0.75rem] uppercase tracking-[0.35em]">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="pb-1 border-b border-transparent hover:border-[var(--primary)]"
                  style={{ color: 'var(--text)' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <Link to="/" className="shrink-0 block transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]">
              <img
                src="/assets/Asset-1.svg"
                alt="Logo Diego Joyero"
                className="w-32 transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              />
            </Link>

            <nav className="flex-1 flex flex-wrap items-center justify-center gap-6 text-[0.68rem] uppercase tracking-[0.35em]">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="pb-1 border-b border-transparent hover:border-[var(--primary)] transition-colors duration-300"
                  style={{ color: 'var(--text)' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-6 shrink-0">
              <button
                type="button"
                onClick={onCartToggle}
                className="flex items-center gap-2 border-b focus:outline-none hover:border-[var(--primary)] transition-colors duration-300"
                style={{
                  color: 'var(--text)',
                  borderColor: isCartOpen ? 'var(--primary)' : 'transparent',
                }}
                aria-label="Ver carrito"
                aria-expanded={isCartOpen}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[0.58rem] uppercase tracking-[0.35em]">Carrito</span>
              </button>

              <div className="flex flex-col items-end text-right leading-none">
                <span className="uppercase tracking-[0.35em] text-[0.6rem]" style={{ color: 'var(--textSecondary)' }}>
                  {currentModeLabel}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  disabled={isTransitioning}
                  className="uppercase tracking-[0.35em] text-[0.58rem] disabled:opacity-60"
                  style={{ color: 'var(--primary)' }}
                >
                  {switchLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
