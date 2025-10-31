import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const storyImages: Record<'gold' | 'silver', string> = {
  gold: 'https://images.unsplash.com/photo-1522312291041-18c175f8d0da?auto=format&fit=crop&w=1600&q=80',
  silver: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
};

export function Story() {
  const { theme } = useTheme();

  const narrative = useMemo(
    () => ({
      title: theme === 'gold' ? 'Legado de la maison' : 'Visión contemporánea',
      introduction:
        theme === 'gold'
          ? 'Fundada en Lima en 1986, la casa Diego Joyero conserva la tradición de la orfebrería peruana, trabajando el oro con paciencia, precisión y respeto por los oficios.'
          : 'Desde nuestro atelier en Lima reinterpretamos la plata con una mirada arquitectónica, buscando líneas puras que ensalzan la luz natural del metal.',
      mission:
        'Crear piezas que acompañen momentos íntimos con la certeza de su origen, su nobleza y la maestría del artesano que las concibió.',
      vision:
        'Perpetuar una joyería sobria, creada para ser heredada, en la que cada trazo responde a un propósito y cada detalle se trabaja a mano.',
    }),
    [theme],
  );

  return (
    <section id="about" className="py-24" style={{ backgroundColor: 'var(--cardBg)' }}>
      <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-[1fr,1.2fr] items-start">
        <figure className="w-full h-[420px] md:h-[520px] overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <img src={storyImages[theme]} alt="Atelier Diego Joyero" className="w-full h-full object-cover" />
        </figure>

        <div className="flex flex-col gap-10">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.5em]" style={{ color: 'var(--textSecondary)' }}>
              Nuestra historia
            </span>
            <h2 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--text)' }}>
              {narrative.title}
            </h2>
          </div>

          <p className="text-base leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
            {narrative.introduction}
          </p>

          <div className="grid gap-8">
            <div className="border-l pl-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-xl font-display mb-3" style={{ color: 'var(--text)' }}>
                Misión
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                {narrative.mission}
              </p>
            </div>

            <div className="border-l pl-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-xl font-display mb-3" style={{ color: 'var(--text)' }}>
                Visión
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                {narrative.vision}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
