import { useTheme } from '../contexts/ThemeContext';

export function Story() {
  const { theme } = useTheme();

  return (
    <section id="about" className="py-24 transition-colors duration-500" style={{ backgroundColor: 'var(--cardBg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 md:h-full overflow-hidden rounded-2xl order-2 md:order-1">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: theme === 'gold'
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(249, 228, 193, 0.3) 100%)'
                  : 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(232, 244, 248, 0.3) 100%)',
              }}
            />
            <div
              className="absolute inset-0 blur-3xl opacity-40"
              style={{
                background: theme === 'gold'
                  ? 'radial-gradient(circle at 50% 50%, #D4AF37, transparent)'
                  : 'radial-gradient(circle at 50% 50%, #00D4FF, transparent)',
              }}
            />
          </div>

          <div className="space-y-8 order-1 md:order-2">
            <div>
              <span className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--primary)' }}>
                Nuestra Historia
              </span>
              <h2
                className="text-4xl md:text-5xl font-serif tracking-wide mt-2 transition-colors duration-500"
                style={{ color: 'var(--text)' }}
              >
                {theme === 'gold' ? 'Tradición Dorada' : 'Modernidad Plateada'}
              </h2>
            </div>

            <p
              className="text-lg leading-relaxed transition-colors duration-500"
              style={{ color: 'var(--textSecondary)' }}
            >
              {theme === 'gold'
                ? 'Diego Joyero nació de la pasión por preservar la herencia de la orfebrería tradicional. Cada pieza de oro es un testimonio de siglos de técnica refinada, combinada con visión contemporánea.'
                : 'Con la plata como lienzo, creamos expresiones modernas de belleza. Nuestro compromiso es diseñar joyas que reflejen la identidad única de cada persona que las porta.'}
            </p>

            <div className="space-y-6">
              <div>
                <h4
                  className="font-serif text-xl mb-2 transition-colors duration-500"
                  style={{ color: 'var(--text)' }}
                >
                  Nuestra Misión
                </h4>
                <p
                  className="transition-colors duration-500"
                  style={{ color: 'var(--textSecondary)' }}
                >
                  Crear piezas de joyería que trascienden lo material, capturando emociones y celebrando momentos significativos en la vida de nuestros clientes.
                </p>
              </div>

              <div>
                <h4
                  className="font-serif text-xl mb-2 transition-colors duration-500"
                  style={{ color: 'var(--text)' }}
                >
                  Nuestra Visión
                </h4>
                <p
                  className="transition-colors duration-500"
                  style={{ color: 'var(--textSecondary)' }}
                >
                  Ser reconocidos globalmente como la marca que redefine la joyería fina, combinando artesanía ancestral con innovación contemporánea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
