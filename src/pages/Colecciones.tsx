import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Palette, Sparkles, Star } from 'lucide-react';

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
      title: 'Diego Joyero nace del arte, la precisión y la pasión por la forma.',
            subtitle: 'Colecciones en oro 18k',
            description:
              'Engastes calados a mano, superficies satinadas y brillos espejo que resguardan el resplandor cálido de nuestro oro certificado.',
            note:
              'Seleccionamos cada gema y cada aleación para que la luz se adhiera a tus rituales cotidianos con una elegancia perpetua.',
          }
    : {
      title: 'Diego Joyero nace del arte, la precisión y la pasión por la forma.',
            subtitle: 'Colecciones en plata 925',
            description:
              'Líneas depuradas, curvas arquitectónicas y acabados perlados que celebran la serenidad de la plata peruana.',
            note:
              'Cada pieza captura la claridad del metal y suaviza la luz sobre la piel con equilibrio minimalista.',
          },
    [theme]
  );

  const explorationPillars = useMemo(
    () => [
      {
        title: 'Curaduría compuesta',
        description:
          'Series limitadas que reúnen piezas icónicas y ediciones especiales de nuestro archivo histórico.',
        icon: Star,
      },
      {
        title: 'Atelier personalizado',
        description:
          'Ajustes de talla, grabados exclusivos y diseño colaborativo con nuestros maestros artesanos.',
        icon: Sparkles,
      },
      {
        title: 'Paleta y mood',
        description:
          'Asesoría cromática para combinar la pieza con el estilo de cada ocasión y lograr armonía total.',
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
          'Reediciones de los diseños más emblemáticos de la maison, inspiradas en nuestros archivos originales de 2023.',
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
