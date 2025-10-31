import { Crown, Shield, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Values() {
  const { theme } = useTheme();

  const values = [
    {
      icon: Crown,
      title: 'Excelencia Artesanal',
      description: 'Cada pieza es creada con precisión y dedicación por maestros joyeros con décadas de experiencia.',
    },
    {
      icon: Shield,
      title: 'Compromiso con la Autenticidad',
      description: 'Certificados de autenticidad en todos nuestros productos, con materiales verificados y garantizados.',
    },
    {
      icon: Sparkles,
      title: 'Diseño con Historia',
      description: 'Nuestras joyas cuentan historias, celebran momentos y perduran a través de las generaciones.',
    },
  ];

  return (
    <section id="values" className="py-24 transition-colors duration-500" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2
            className="text-4xl md:text-5xl font-serif tracking-wide transition-colors duration-500"
            style={{ color: 'var(--text)' }}
          >
            Nuestros Pilares
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group text-center transition-all duration-500 hover:scale-105"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:shadow-xl"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--primary)',
                    boxShadow: `0 10px 30px var(--shadow)`,
                  }}
                >
                  <Icon className="w-10 h-10" />
                </div>

                <h3
                  className="text-2xl font-serif mb-3 transition-colors duration-500"
                  style={{ color: 'var(--text)' }}
                >
                  {value.title}
                </h3>

                <p
                  className="text-base leading-relaxed transition-colors duration-500"
                  style={{ color: 'var(--textSecondary)' }}
                >
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
