import type { Product } from './supabase';

const iso = (date: string) => new Date(date).toISOString();

export const fallbackProducts: Record<'gold' | 'silver', Product[]> = {
  gold: [
    {
      id: 'gold-aurora-sortija',
      name: 'Sortija Aurora',
      description:
        'Anillo escultórico en oro amarillo 18k con pavé de diamantes talla brillante que enmarca el centro en degradé.',
      price: 12850,
      material: 'gold',
      category: 'Anillos',
      image_url:
        'https://images.unsplash.com/photo-1522312291041-18c175f8d0da?auto=format&fit=crop&w=1200&q=80',
      stock: 3,
      featured: true,
      created_at: iso('2024-01-05T12:00:00Z'),
      updated_at: iso('2024-03-12T12:00:00Z'),
    },
    {
      id: 'gold-riviera-collar',
      name: 'Collar Riviera',
      description:
        'Collar articulado en oro 18k con diamantes graduados seleccionados a mano siguiendo la curva del escote.',
      price: 24800,
      material: 'gold',
      category: 'Cadenas',
      image_url:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      stock: 1,
      featured: true,
      created_at: iso('2024-02-10T12:00:00Z'),
      updated_at: iso('2024-02-18T12:00:00Z'),
    },
    {
      id: 'gold-aurum-pulsera',
      name: 'Pulsera Aurum',
      description:
        'Eslabones satinados y pulidos en espejo alternados para generar destellos cálidos en movimiento.',
      price: 9850,
      material: 'gold',
      category: 'Sets',
      image_url:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      stock: 5,
      featured: false,
      created_at: iso('2023-11-01T12:00:00Z'),
      updated_at: iso('2024-04-01T12:00:00Z'),
    },
    {
      id: 'gold-solstice-aretes',
      name: 'Aretes Solstice',
      description:
        'Aretes colgantes con juegos de diamantes baguette y talla brillante suspendidos en estructuras móviles.',
      price: 11200,
      material: 'gold',
      category: 'Aros',
      image_url:
        'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80',
      stock: 2,
      featured: false,
      created_at: iso('2024-03-20T12:00:00Z'),
      updated_at: iso('2024-03-28T12:00:00Z'),
    },
    {
      id: 'gold-celestial-broche',
      name: 'Broche Celestial',
      description:
        'Broche ondulado en oro 18k con microgranulado y diamantes marquise suspendidos sobre estructura liviana.',
      price: 7650,
      material: 'gold',
      category: 'Broches',
      image_url:
        'https://images.unsplash.com/photo-1529257414771-1960ab1db93b?auto=format&fit=crop&w=1200&q=80',
      stock: 4,
      featured: false,
      created_at: iso('2024-04-12T12:00:00Z'),
      updated_at: iso('2024-04-18T12:00:00Z'),
    },
    {
      id: 'gold-lirio-dije',
      name: 'Dije Lirio',
      description:
        'Colgante en oro 18k con talla pera suspendida y marcos en filigrana calada inspirada en la flor de lirio.',
      price: 5480,
      material: 'gold',
      category: 'Dijes',
      image_url:
        'https://images.unsplash.com/photo-1516637090014-cb1ab0d08fc7?auto=format&fit=crop&w=1200&q=80',
      stock: 3,
      featured: true,
      created_at: iso('2024-04-28T12:00:00Z'),
      updated_at: iso('2024-05-04T12:00:00Z'),
    },
  ],
  silver: [
    {
      id: 'silver-luz-anillo',
      name: 'Anillo Luz',
      description:
        'Diseño minimalista en plata 925 con acabado perlado y detalle de ónix engastado en tensión.',
      price: 1850,
      material: 'silver',
      category: 'Anillos',
      image_url:
        'https://images.unsplash.com/photo-1522312291041-18c175f8d0da?auto=format&fit=crop&w=1200&q=80',
      stock: 6,
      featured: true,
      created_at: iso('2024-01-20T12:00:00Z'),
      updated_at: iso('2024-03-05T12:00:00Z'),
    },
    {
      id: 'silver-zenith-collar',
      name: 'Collar Zenith',
      description:
        'Collar lineal en plata 925 con segmentos articulados y acabado espejo para reflejar la luz.',
      price: 2650,
      material: 'silver',
      category: 'Cadenas',
      image_url:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      stock: 4,
      featured: true,
      created_at: iso('2024-02-14T12:00:00Z'),
      updated_at: iso('2024-03-21T12:00:00Z'),
    },
    {
      id: 'silver-arcarete',
      name: 'Aretes Arc',
      description:
        'Aretes geométricos en plata con curvas suaves y estructura hueca para una sensación ligera.',
      price: 1490,
      material: 'silver',
      category: 'Aros',
      image_url:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      stock: 8,
      featured: false,
      created_at: iso('2023-12-08T12:00:00Z'),
      updated_at: iso('2024-02-01T12:00:00Z'),
    },
    {
      id: 'silver-lattice-pulsera',
      name: 'Pulsera Lattice',
      description:
        'Pulsera modular en plata satinada con patrón calado inspirado en arquitectura contemporánea.',
      price: 1720,
      material: 'silver',
      category: 'Sets',
      image_url:
        'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80',
      stock: 5,
      featured: false,
      created_at: iso('2024-01-02T12:00:00Z'),
      updated_at: iso('2024-02-14T12:00:00Z'),
    },
    {
      id: 'silver-nebula-broche',
      name: 'Broche Nebula',
      description:
        'Broche minimalista en plata 925 oxidada con incrustaciones de cuarzo rutilado y textura satinada.',
      price: 2120,
      material: 'silver',
      category: 'Broches',
      image_url:
        'https://images.unsplash.com/photo-1551133990-7016c02c8eb1?auto=format&fit=crop&w=1200&q=80',
      stock: 7,
      featured: false,
      created_at: iso('2024-03-02T12:00:00Z'),
      updated_at: iso('2024-04-08T12:00:00Z'),
    },
    {
      id: 'silver-prisma-dije',
      name: 'Dije Prisma',
      description:
        'Dije en plata satín con cuarzo transparente facetado y engastes invisibles para un acabado etéreo.',
      price: 1980,
      material: 'silver',
      category: 'Dijes',
      image_url:
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1200&q=80',
      stock: 6,
      featured: true,
      created_at: iso('2024-04-09T12:00:00Z'),
      updated_at: iso('2024-04-20T12:00:00Z'),
    },
  ],
};
