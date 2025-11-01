import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Crown, Diamond, Heart, Palette, Sparkles, Star, Zap } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { ProductCatalog } from '../components/ProductCatalog';
import { Button } from '../components/ui/button';

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], when: 'beforeChildren', staggerChildren: 0.12 },
  },
};

const heroContentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

const highlightVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], when: 'beforeChildren', staggerChildren: 0.14 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

const calloutVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] } },
};

export function ColeccionesPage() {
  const { theme } = useTheme();

  const narrative = useMemo(
    () =>
      theme === 'gold'
        ? {
            title: 'Colecciones Exclusivas en Oro 18k',
            subtitle: 'Maestría artesanal',
            description:
              'Cada pieza nace de la tradición orfebre peruana, fusionando técnicas ancestrales con el diseño contemporáneo más refinado.',
            note:
              'Oro certificado, engastes precisos y acabados que capturan la luz en cada ángulo para acompañar tus momentos más especiales.',
          }
        : {
            title: 'Colecciones Contemporáneas en Plata 925',
            subtitle: 'Elegancia minimalista',
            description:
              'Líneas puras y formas geométricas que celebran la versatilidad de la plata peruana en diseños atemporales.',
            note:
              'Superficies espejo y texturas satinadas que reflejan la luz con sutileza, perfectas para el uso cotidiano y las ocasiones especiales.',
          },
    [theme]
  );

  const collections = useMemo(
    () => [
      {
        title: 'Atelier Exclusivo',
        description: 'Piezas únicas creadas en colaboración con nuestros maestros artesanos',
        image: theme === 'gold' 
          ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&crop=center'
          : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop&crop=center',
        icon: Crown,
        color: theme === 'gold' ? 'from-amber-500/20 to-yellow-600/20' : 'from-slate-400/20 to-gray-500/20'
      },
      {
        title: 'Serie Contemporánea',
        description: 'Diseños minimalistas para el estilo de vida moderno',
        image: theme === 'gold'
          ? 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=400&fit=crop&crop=center'
          : 'https://images.unsplash.com/photo-1506629905607-34b31c2e27d8?w=600&h=400&fit=crop&crop=center',
        icon: Diamond,
        color: theme === 'gold' ? 'from-amber-400/20 to-orange-500/20' : 'from-blue-400/20 to-indigo-500/20'
      },
      {
        title: 'Colección Clásica',
        description: 'Diseños atemporales inspirados en la tradición orfebre',
        image: theme === 'gold'
          ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&crop=center'
          : 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=400&fit=crop&crop=center',
        icon: Heart,
        color: theme === 'gold' ? 'from-yellow-500/20 to-amber-600/20' : 'from-purple-400/20 to-pink-500/20'
      }
    ],
    [theme]
  );

  const explorationPillars = useMemo(
    () => [
      {
        title: 'Curaduría Experta',
        description:
          'Selección meticulosa de gemas y materiales premium con certificación de origen y calidad garantizada.',
        icon: Star,
      },
      {
        title: 'Personalización Total',
        description:
          'Ajustes de medida, grabados exclusivos y modificaciones de diseño adaptadas a tu estilo personal.',
        icon: Sparkles,
      },
      {
        title: 'Asesoría Especializada',
        description:
          'Consultoría en imagen y estilo para crear combinaciones perfectas con tu guardarropa y ocasiones.',
        icon: Palette,
      },
    ],
    []
  );

  const experienceNotes = useMemo(
    () => [
      {
        title: 'Serie Atelier',
        body:
          'Piezas únicas desarrolladas junto a nuestros clientes, con certificados de proceso y gemas seleccionadas ad hoc.',
      },
      {
        title: 'Colección Archivo',
        body:
          'Reediciones de los diseños más emblemáticos de la maison, inspiradas en nuestros archivos originales de 2024.',
      },
      {
        title: 'Selección Contemporánea',
        body:
          'Diseños de líneas minimalistas pensados para uso cotidiano, con ergonomía y balance perfectos.',
      },
    ],
    []
  );

  return (
    <div className="bg-background text-foreground">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="border-b py-24"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-end">
          <motion.div className="space-y-6 md:w-2/3" variants={heroContentVariants}>
            <motion.p className="text-xs uppercase tracking-[0.45em] text-muted-foreground" variants={heroContentVariants}>
              Colecciones
            </motion.p>
            <motion.h1 className="text-4xl font-light tracking-tight md:text-6xl" variants={heroContentVariants}>
              {narrative.title}
            </motion.h1>
            <motion.p className="text-lg font-light text-muted-foreground md:text-xl" variants={heroContentVariants}>
              {narrative.description}
            </motion.p>
          </motion.div>

          <motion.div className="md:w-1/3" variants={heroContentVariants}>
            <motion.div
              className="space-y-4 rounded-xl border px-6 py-8"
              style={{ borderColor: 'var(--border)' }}
              variants={heroContentVariants}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{narrative.subtitle}</p>
              <p className="text-sm font-light leading-relaxed text-foreground/80">
                {narrative.note}
              </p>
              <motion.div variants={heroContentVariants}>
                <Button asChild variant="outline" className="mt-2 w-full justify-center gap-3 uppercase tracking-[0.35em]">
                  <a href="#catalogo" className="flex items-center gap-3">
                    Explorar catálogo
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={highlightVariants}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-6xl px-6 py-20"
      >
        <div className="grid gap-10 md:grid-cols-3">
          {explorationPillars.map(({ title, description, icon: Icon }) => (
            <motion.article
              key={title}
              className="space-y-5 rounded-xl border p-8"
              style={{ borderColor: 'var(--border)' }}
              variants={cardVariants}
            >
              <Icon className="h-9 w-9" style={{ color: 'var(--primary)' }} />
              <h2 className="text-2xl font-light tracking-tight">{title}</h2>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">{description}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <FeaturedProducts />

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={highlightVariants}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <div className="mb-12 space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">Series curadas</p>
          <h2 className="text-3xl font-light tracking-tight md:text-4xl">Trayectorias dentro de la maison</h2>
          <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-muted-foreground">
            Selecciona la colección que resuene con tu estilo y solicita asesoría personalizada para explorar combinaciones,
            ajustes y gemas exclusivas.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {experienceNotes.map(({ title, body }) => (
            <motion.div
              key={title}
              className="space-y-4 rounded-xl border p-8"
              style={{ borderColor: 'var(--border)' }}
              variants={cardVariants}
            >
              <h3 className="text-xl font-light tracking-tight">{title}</h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section id="catalogo">
        <ProductCatalog />
      </section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={highlightVariants}
        transition={{ duration: 0.7 }}
        className="border-t bg-card py-24"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-[1.1fr,0.9fr] md:items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Experiencia boutique</p>
              <h2 className="text-3xl font-light tracking-tight md:text-4xl">
                Curamos sesiones privadas para descubrir la pieza ideal
              </h2>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                Nuestro equipo de gemólogos y diseñadores te orienta en materiales, gemas y medidas para construir tu joya sin
                compromisos. Agenda una cita para explorar prototipos, acabados y personalización completa.
              </p>
              <motion.div variants={calloutVariants}>
                <Button asChild className="gap-2 uppercase tracking-[0.35em]">
                  <a href="/contacto">
                    Agendar cita privada
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            </div>

            <div className="grid gap-6 rounded-xl border p-8" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Sesión Immersiva</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  Moodboards, bocetos y pruebas en 3D para visualizar la pieza antes de producirla.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Curaduría de gemas</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  Gemas seleccionadas por color, pureza y procedencia certificada.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Entrega ceremonial</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  Presentación personalizada y documentación completa de tu pieza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
