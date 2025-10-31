import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const contactDetails = [
  { label: 'Lima, Perú', icon: MapPin },
  { label: '+51 1 2345 6789', icon: Phone },
  { label: 'atelier@diegojoyero.com', icon: Mail },
];

export function Footer() {
  const { theme } = useTheme();

  const networks = [
    { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  ];

  return (
    <footer
      id="contact"
      className="border-t"
      style={{ borderColor: 'var(--border)', backgroundColor: theme === 'gold' ? '#f4efe4' : '#f8f8f8' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        <div className="flex flex-col items-center text-center gap-5">
          <img src="/assets/Asset-1.svg" alt="Diego Joyero" className="w-32" />
          <p className="text-xs uppercase tracking-[0.45em]" style={{ color: 'var(--textSecondary)' }}>
            Maison de joaillerie
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-[1.1fr,1fr]">
          <div className="space-y-6">
            <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
              Citas privadas
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
              Atendemos únicamente con cita previa en nuestro atelier de Lima. Escríbenos para coordinar una
              visita personalizada o un servicio de mantenimiento para tus piezas.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
              Contacto directo
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--textSecondary)' }}>
              {contactDetails.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-3 uppercase tracking-[0.35em]">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-6">
              {networks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  className="text-xs uppercase tracking-[0.45em] border-b border-transparent hover:border-[var(--primary)]"
                  style={{ color: 'var(--primary)' }}
                  aria-label={name}
                >
                  <Icon className="w-4 h-4 inline-block mr-2" />
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.65rem] uppercase tracking-[0.4em]" style={{ borderColor: 'var(--border)', color: 'var(--textSecondary)' }}>
          <span>© 2024 Diego Joyero</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--text)]">Privacidad</a>
            <a href="#" className="hover:text-[var(--text)]">Términos</a>
            <a href="#" className="hover:text-[var(--text)]">Garantías</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
