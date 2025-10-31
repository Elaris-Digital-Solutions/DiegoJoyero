import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'gold' | 'silver';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const goldTheme = {
  primary: '#D4AF37',
  secondary: '#F4E4C1',
  accent: '#C9A961',
  background: '#FFF9F0',
  cardBg: '#FFFBF5',
  text: '#3A3226',
  textSecondary: '#6B5D4F',
  border: '#E8D7BC',
  shadow: 'rgba(212, 175, 55, 0.15)',
  gradient: 'linear-gradient(135deg, #FFF9F0 0%, #F4E4C1 100%)',
  glow: 'rgba(212, 175, 55, 0.3)',
};

export const silverTheme = {
  primary: '#C0C0C0',
  secondary: '#E8F4F8',
  accent: '#00D4FF',
  background: '#F0F4F8',
  cardBg: '#FFFFFF',
  text: '#1A2332',
  textSecondary: '#4A5568',
  border: '#CBD5E0',
  shadow: 'rgba(0, 212, 255, 0.15)',
  gradient: 'linear-gradient(135deg, #F0F4F8 0%, #E8F4F8 100%)',
  glow: 'rgba(0, 212, 255, 0.3)',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('gold');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const currentTheme = theme === 'gold' ? goldTheme : silverTheme;
    const root = document.documentElement;

    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    root.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    if (newTheme === theme) return;

    setIsTransitioning(true);
    setThemeState(newTheme);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const toggleTheme = () => {
    setTheme(theme === 'gold' ? 'silver' : 'gold');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
