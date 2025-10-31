import { useTheme } from '../contexts/ThemeContext';

export function Guarantees() {
  const { theme } = useTheme();

  const guarantees = [
    {
      title: 'Certificado de Autenticidad',
      description: theme === 'gold'
        ? 'Oro 18k certificado, con certificados de autenticidad respaldados por gemólogos independientes.'
        : 'Plata 925 certificada, con garantía de pureza y calidad verificadas.',
    },
    {
      title: 'Hecho a Mano',
      description: 'Cada pieza es elaborada meticulosamente por maestros artesanos con más de 20 años de experiencia en joyería fina.',
    },
    {
      title: 'Garantía de por Vida',
      description: 'Limpieza, mantenimiento y reparaciones garantizadas de por vida. Tu joya es una inversión que cuidaremos siempre.',
    },
  ];

  return (
    <section id="guarantees" className="py-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.5em]" style={{ color: 'var(--textSecondary)' }}>
            Garantía y cuidado
          </span>
          <h2 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--text)' }}>
            Promesa Diego Joyero
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
            Acompañamos cada pieza desde su concepción hasta su conservación, con procedimientos certificados y
            servicios de por vida.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {guarantees.map((guarantee) => (
            <article key={guarantee.title} className="border-t pt-8 flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
                {guarantee.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                {guarantee.description}
              </p>
            </article>
          ))}
        </div>

        <div className="grid gap-12 md:grid-cols-2 border-t pt-12" style={{ borderColor: 'var(--border)' }}>
          <div className="space-y-4">
            <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
              {theme === 'gold' ? 'Oro 18 quilates' : 'Plata ley 925'}
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--textSecondary)' }}>
              <li className="uppercase tracking-[0.35em]">Certificado de pureza emitido por gemólogos</li>
              <li className="uppercase tracking-[0.35em]">Trazabilidad completa de metales y gemas</li>
              <li className="uppercase tracking-[0.35em]">Producción en talleres propios</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
              Servicio perpetuo
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--textSecondary)' }}>
              <li className="uppercase tracking-[0.35em]">Limpieza y pulido anual sin coste</li>
              <li className="uppercase tracking-[0.35em]">Revisión de engastes y ajustes de talla</li>
              <li className="uppercase tracking-[0.35em]">Seguro de reparación de por vida</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
