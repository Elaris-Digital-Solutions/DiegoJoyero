import { CheckCircle, Award, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Guarantees() {
  const { theme } = useTheme();

  const guarantees = [
    {
      icon: Award,
      title: 'Certificado de Autenticidad',
      description: theme === 'gold'
        ? 'Oro 18k certificado, con certificados de autenticidad respaldados por gemólogos independientes.'
        : 'Plata 925 certificada, con garantía de pureza y calidad verificadas.',
    },
    {
      icon: CheckCircle,
      title: 'Hecho a Mano',
      description: 'Cada pieza es elaborada meticulosamente por maestros artesanos con más de 20 años de experiencia en joyería fina.',
    },
    {
      icon: Clock,
      title: 'Garantía de por Vida',
      description: 'Limpieza, mantenimiento y reparaciones garantizadas de por vida. Tu joya es una inversión que cuidaremos siempre.',
    },
  ];

  return (
    <section className="py-24 transition-colors duration-500" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2
            className="text-4xl md:text-5xl font-serif tracking-wide transition-colors duration-500"
            style={{ color: 'var(--text)' }}
          >
            Garantía y Calidad
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto transition-colors duration-500"
            style={{ color: 'var(--textSecondary)' }}
          >
            Cada joya de Diego Joyero responde a los más altos estándares de calidad y autenticidad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-500 hover:scale-105"
                style={{
                  backgroundColor: 'var(--cardBg)',
                  border: '1px solid var(--border)',
                  boxShadow: `0 4px 20px var(--shadow)`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--primary)',
                  }}
                >
                  <Icon className="w-8 h-8" />
                </div>

                <h3
                  className="text-2xl font-serif mb-3 transition-colors duration-500"
                  style={{ color: 'var(--text)' }}
                >
                  {guarantee.title}
                </h3>

                <p
                  className="text-base leading-relaxed transition-colors duration-500"
                  style={{ color: 'var(--textSecondary)' }}
                >
                  {guarantee.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 rounded-2xl transition-all duration-500" style={{ backgroundColor: 'var(--secondary)' }}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-serif mb-3" style={{ color: 'var(--text)' }}>
                {theme === 'gold' ? 'Oro 18 Quilates' : 'Plata 925'}
              </h4>
              <ul className="space-y-2" style={{ color: 'var(--textSecondary)' }}>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>{theme === 'gold' ? '750 partes de oro puro (75%)' : '925 partes de plata pura por 1000'}</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Certificado de pureza incluido</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Resistente y duradero</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-serif mb-3" style={{ color: 'var(--text)' }}>
                Cuidado y Mantenimiento
              </h4>
              <ul className="space-y-2" style={{ color: 'var(--textSecondary)' }}>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Limpieza profesional gratuita anualmente</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Reparaciones cubiertas por garantía</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Repoladoras y ajustes de talla incluidos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
