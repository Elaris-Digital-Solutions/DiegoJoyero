import { Globe, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const contactDetails = [
  { label: 'Atelier', value: 'Lima, Perú', icon: MapPin },
  { label: 'Teléfono', value: '+51 1 2345 6789', icon: Phone, href: 'tel:+51992856599' },
 
  {
    label: 'Trabaja con nosotros',
    value: 'partnersdiegojoyero@gmail.com',
    icon: Mail,
    href: 'mailto:partnersdiegojoyero@gmail.com',
  },
  {
    label: 'Dudas / Reclamos',
    value: 'clientesdiegojoyero@gmail.com',
    icon: Mail,
    href: 'mailto:clientesdiegojoyero@gmail.com',
  },
];

export function Footer() {
  const { theme } = useTheme();

  const networks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/diego.joyero?igshid=ZGNjOWZkYTE3MQ%3D%3D&utm_source=qr',
      icon: Instagram,
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@diego.joyero925?_t=8iIxkY9zR4v&_r=1',
      icon: Globe,
    },
  ];

  return (
    <footer
      id="contact"
      className="border-t"
      style={{ borderColor: 'var(--border)', backgroundColor: theme === 'gold' ? '#f4efe4' : '#f8f8f8' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-12 md:grid-cols-[1.1fr,1fr] items-start">
          <div className="space-y-8">
            <div className="space-y-3">
              <img src="/assets/Asset-1.svg" alt="Diego Joyero" className="w-28" />
              <p className="text-[0.6rem] uppercase tracking-[0.45em]" style={{ color: 'var(--textSecondary)' }}>
                Maison de joaillerie
              </p>
            </div>

            <div className="space-y-5">
              <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
                Joyas hechas a tu historia
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                Diseñamos piezas únicas a partir de sesiones privadas donde interpretamos tus ideas, memorias o piedras
                heredadas. Cada joya se modela a medida, con bocetos, prototipos y un proceso artesanal que garantiza un
                resultado irrepetible.
              </p>
              <Link
                to="/contacto"
                className="inline-block text-xs uppercase tracking-[0.4em] border-b border-transparent transition-colors hover:border-[var(--primary)]"
                style={{ color: 'var(--primary)' }}
              >
                Agendar una cita personalizada
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
              Contacto directo
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--textSecondary)' }}>
              {contactDetails.map(({ label, value, href, icon: Icon }) => (
                <li key={`${label}-${value}`} className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col text-left">
                    <span className="text-[0.55rem] uppercase tracking-[0.4em] text-muted-foreground">{label}</span>
                    {href ? (
                      <a
                        href={href}
                        className="uppercase tracking-[0.32em] transition-colors hover:text-[var(--primary)]"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="uppercase tracking-[0.32em]">{value}</span>
                    )}
                  </div>
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
