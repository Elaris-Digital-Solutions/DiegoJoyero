import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, Boxes, CheckCircle2, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { AdminLayout } from '../components/AdminLayout';
import { QuickStats } from '../components/QuickStats';
import type { QuickStatItem } from '../components/QuickStats';
import { QuickActions } from '../components/QuickActions';
import { InventorySnapshot } from '../components/InventorySnapshot';
import type { InventorySnapshotProps } from '../components/InventorySnapshot';
import { ProductTable } from '../components/ProductTable';
import type { ProductRecord } from '../components/ProductTable';
import { ActivityFeed } from '../components/ActivityFeed';
import type { ActivityItem, ActivityAction } from '../components/ActivityFeed';

type SectionKey = 'resumen' | 'catalogo' | 'pedidos' | 'reportes' | 'ajustes';

const SECTION_TITLES: Record<SectionKey, string> = {
  resumen: 'Panel de la joyería',
  catalogo: 'Gestión del catálogo',
  pedidos: 'Pedidos',
  reportes: 'Reportes',
  ajustes: 'Ajustes del equipo',
};

const SECTION_PLACEHOLDER_COPY: Record<Exclude<SectionKey, 'resumen' | 'catalogo'>, { heading: string; description: string }> = {
  pedidos: {
    heading: 'Seguimiento de pedidos en construcción',
    description: 'Muy pronto podrás visualizar el estado de cada orden y resolver incidencias desde un solo lugar.',
  },
  reportes: {
    heading: 'Reportes avanzados en camino',
    description: 'Estamos preparando dashboards con métricas de ventas, colecciones destacadas y desempeño por canal.',
  },
  ajustes: {
    heading: 'Configura tu equipo pronto',
    description: 'Gestiona roles, accesos y preferencias del estudio en el módulo que habilitaremos en las próximas iteraciones.',
  },
};

const PRIORITY_TASKS = [
  'Revisar fotos del set Ceremonial Oro',
  'Actualizar stock de la colección Plata Minimal',
  'Configurar banner para campaña de fin de año',
];

const resolveSection = (pathname: string): SectionKey => {
  const normalized = pathname.replace(/\/+/g, '/').replace(/\/$/, '');
  if (normalized === '/admin' || normalized === '/admin/resumen') {
    return 'resumen';
  }

  const suffix = normalized.startsWith('/admin/') ? normalized.slice('/admin/'.length) : '';
  if (suffix === 'catalogo' || suffix === 'pedidos' || suffix === 'reportes' || suffix === 'ajustes') {
    return suffix;
  }

  return 'resumen';
};

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(value);

const formatRelativeTime = (isoDate: string) => {
  const now = Date.now();
  const target = new Date(isoDate).getTime();
  const diffMs = now - target;
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes <= 1) return 'Hace instantes';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} días`;
  const diffWeeks = Math.round(diffDays / 7);
  if (diffWeeks < 4) return `Hace ${diffWeeks} semanas`;
  const diffMonths = Math.round(diffDays / 30);
  return diffMonths <= 1 ? 'Hace 1 mes' : `Hace ${diffMonths} meses`;
};

const initialProducts: ProductRecord[] = [
  {
    id: createId(),
    name: 'Anillo Petra Oro 18k',
    description: 'Oro sólido de 18 quilates con incrustaciones en forma de pétalo.',
    price: 1280,
    stock: 12,
    category: 'Anillos',
    status: 'active',
    imageUrl: '/assets/collections/anillo-oro.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: createId(),
    name: 'Sortija Aura Topacio',
    description: 'Topacio azul cielo con engaste francés sobre aro de oro.',
    price: 980,
    stock: 2,
    category: 'Anillos',
    status: 'active',
    imageUrl: '/assets/collections/anillo-topacio.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: createId(),
    name: 'Aretes Celeste Perla',
    description: 'Perlas cultivadas con baño de rodio. Ideal para novias.',
    price: 620,
    stock: 0,
    category: 'Aros',
    status: 'inactive',
    imageUrl: '/assets/collections/aretes-perla.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: createId(),
    name: 'Pulsera Lienzo Plata',
    description: 'Plata 950 con textura martillada y cierre magnético.',
    price: 540,
    stock: 7,
    category: 'Pulseras',
    status: 'active',
    imageUrl: '/assets/collections/pulsera-plata.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

const initialActivities: ActivityItem[] = [
  {
    id: createId(),
    action: 'create',
    title: 'Colección bodas publicada',
    description: 'Se agregaron 5 piezas de la línea Bodas 2025.',
    timestamp: formatRelativeTime(new Date(Date.now() - 1000 * 60 * 20).toISOString()),
  },
  {
    id: createId(),
    action: 'update',
    title: 'Precio actualizado',
    description: 'Anillo Petra Oro 18k ahora cuesta S/ 1,280.',
    timestamp: formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()),
  },
  {
    id: createId(),
    action: 'delete',
    title: 'Set Primavera retirado',
    description: 'El set Primavera ha sido dado de baja temporalmente.',
    timestamp: formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()),
  },
];

export function DashboardView() {
  const location = useLocation();
  const section = resolveSection(location.pathname);
  const [products, setProducts] = useState<ProductRecord[]>(initialProducts);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const metrics = useMemo(() => {
    const total = products.length;
    const active = products.filter((product) => product.status === 'active').length;
    const inactive = total - active;
    const lowStock = products.filter((product) => product.status === 'active' && product.stock > 0 && product.stock <= 3).length;
    const outOfStock = products.filter((product) => product.stock === 0).length;
    const totalValue = products.reduce((accumulator, product) => accumulator + product.price * product.stock, 0);
    const lastProduct = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    const inventorySnapshot: InventorySnapshotProps = {
      totalProducts: total,
      activeProducts: active,
      inactiveProducts: inactive,
      lowStockProducts: lowStock,
      lastProductAdded: lastProduct
        ? {
            name: lastProduct.name,
            addedAt: formatRelativeTime(lastProduct.createdAt),
          }
        : undefined,
    };

    return {
      total,
      active,
      inactive,
      lowStock,
      outOfStock,
      totalValue,
      inventorySnapshot,
    };
  }, [products]);

  const quickStats: QuickStatItem[] = [
    {
      id: 'active-products',
      label: 'Productos activos',
      value: `${metrics.active}`,
      helper: 'Mostrándose al público',
      icon: CheckCircle2,
      tone: 'success',
    },
    {
      id: 'inventory-value',
      label: 'Valor inventario',
      value: formatCurrency(metrics.totalValue),
      helper: 'Solo piezas activas',
      icon: DollarSign,
    },
    {
      id: 'low-stock',
      label: 'Stock bajo',
      value: `${metrics.lowStock}`,
      helper: 'Menos de 3 unidades disponibles',
      icon: AlertTriangle,
      tone: 'warning',
    },
    {
      id: 'inactive-products',
      label: 'Inactivos',
      value: `${metrics.inactive}`,
      helper: 'Ocultos temporalmente',
      icon: Boxes,
    },
  ];

  const handleAddActivity = (action: ActivityAction, title: string, description: string) => {
    setActivities((previous) => [
      {
        id: createId(),
        action,
        title,
        description,
        timestamp: formatRelativeTime(new Date().toISOString()),
      },
      ...previous,
    ]);
  };

  const handleCreateProduct = (product: ProductRecord) => {
    setProducts((previous) => [product, ...previous]);
    handleAddActivity('create', 'Nuevo producto publicado', `${product.name} está disponible en el catálogo.`);
  };

  const handleUpdateProduct = (updatedProduct: ProductRecord) => {
    setProducts((previous) =>
      previous.map((product) => (product.id === updatedProduct.id ? { ...updatedProduct } : product))
    );
    handleAddActivity('update', 'Ficha de producto actualizada', `${updatedProduct.name} fue editado desde el panel.`);
  };

  const handleDeleteProduct = (productId: string) => {
    const removedProduct = products.find((product) => product.id === productId);
    setProducts((previous) => previous.filter((product) => product.id !== productId));
    if (removedProduct) {
      handleAddActivity('delete', 'Producto eliminado', `${removedProduct.name} se ocultó del catálogo.`);
    }
  };

  const handleImportProducts = () => {
    importInputRef.current?.click();
  };

  const parseCsv = (content: string) => {
    const normalize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0000-\u001F]/g, '')
        .replace(/[\u0300-\u036f]/g, '');

    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length <= 1) return [];

    const headers = lines[0]
      .split(/[,;\t]/)
      .map((header) => normalize(header).trim().toLowerCase());
    const nameIndex = headers.findIndex((header) => header === 'nombre' || header === 'name');
    if (nameIndex === -1) return [];

    const descriptionIndex = headers.findIndex((header) => header === 'descripcion' || header === 'description');
    const priceIndex = headers.findIndex((header) => header === 'precio' || header === 'price');
    const stockIndex = headers.findIndex((header) => header === 'stock');
    const categoryIndex = headers.findIndex((header) => header === 'categoria' || header === 'category');
    const statusIndex = headers.findIndex((header) => header === 'estado' || header === 'status');
    const imageIndex = headers.findIndex((header) => header === 'imagen' || header === 'image' || header === 'imageurl');

    const newProducts: ProductRecord[] = [];

    lines.slice(1).forEach((line) => {
      const values = line.split(/[,;\t]/).map((value) => value.trim());
      const name = values[nameIndex];
      if (!name) return;

      const nowIso = new Date().toISOString();
      const price = priceIndex >= 0 ? Number(values[priceIndex].replace(/[^0-9.,]/g, '').replace(',', '.')) : 0;
      const stock = stockIndex >= 0 ? Number(values[stockIndex]) : 0;
      const statusRaw = statusIndex >= 0 ? normalize(values[statusIndex]).toLowerCase() : 'activo';
      const status = statusRaw === 'inactivo' || statusRaw === 'inactive' ? 'inactive' : 'active';

      newProducts.push({
        id: createId(),
        name,
        description: descriptionIndex >= 0 ? values[descriptionIndex] : '',
        price: Number.isFinite(price) ? price : 0,
        stock: Number.isFinite(stock) ? stock : 0,
        category: categoryIndex >= 0 ? values[categoryIndex] || 'Sin categoría' : 'Sin categoría',
        status,
        imageUrl: imageIndex >= 0 ? values[imageIndex] : '',
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    });

    return newProducts;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const importedProducts = parseCsv(text);
      if (importedProducts.length === 0) {
        handleAddActivity('import', 'Importación sin cambios', 'No se detectaron filas válidas en el archivo.');
      } else {
        setProducts((previous) => [...importedProducts, ...previous]);
        handleAddActivity(
          'import',
          'Productos importados',
          `${importedProducts.length} producto(s) se añadieron desde Excel/CSV.`
        );
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSyncInventory = () => {
    handleAddActivity('update', 'Sincronización completada', 'El inventario se actualizó con los datos de la tienda.');
  };

  let actionSlot: ReactNode | undefined;
  let content: ReactNode;
  let showHeaderSearch = false;
  let onAddProduct: (() => void) | undefined;
  let searchValue: string | undefined;
  let onSearchChange: ((value: string) => void) | undefined;

  if (section === 'catalogo') {
    showHeaderSearch = true;
    onAddProduct = () => setIsCreateModalOpen(true);
    searchValue = searchTerm;
    onSearchChange = setSearchTerm;
    content = (
      <div className="space-y-6">
        <QuickActions
          onCreateProduct={() => setIsCreateModalOpen(true)}
          onImportProducts={handleImportProducts}
          onSyncInventory={handleSyncInventory}
        />
        <ProductTable
          products={products}
          onCreateProduct={handleCreateProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          isCreateModalOpen={isCreateModalOpen}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onCloseCreateModal={() => setIsCreateModalOpen(false)}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <InventorySnapshot {...metrics.inventorySnapshot} />
          <ActivityFeed items={activities} />
        </div>
      </div>
    );
  } else if (section === 'resumen') {
    actionSlot = (
      <Card className="border border-primary/30 bg-primary/5">
        <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.32em] text-primary">
              <AlertTriangle className="h-4 w-4" />
              Prioridades del día
            </CardTitle>
            <CardDescription className="text-sm text-primary/80">
              Te sugerimos acciones rápidas para mantener el catálogo impecable.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {PRIORITY_TASKS.map((task) => (
            <div key={task} className="rounded-lg border border-primary/20 bg-white/80 px-4 py-3 text-sm text-primary/90">
              {task}
            </div>
          ))}
        </CardContent>
      </Card>
    );
    content = (
      <>
        <QuickStats items={quickStats} />
        <div className="grid gap-6 xl:grid-cols-2">
          <InventorySnapshot {...metrics.inventorySnapshot} />
          <ActivityFeed items={activities} />
        </div>
      </>
    );
  } else {
    const placeholder = SECTION_PLACEHOLDER_COPY[section];
    content = <SectionPlaceholder heading={placeholder.heading} description={placeholder.description} />;
  }

  return (
    <AdminLayout
      pageTitle={SECTION_TITLES[section]}
      actionSlot={actionSlot}
      onAddProduct={onAddProduct}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre, SKU o colección"
      searchValue={searchValue}
      showHeaderSearch={showHeaderSearch}
    >
      {content}
      <input
        ref={importInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />
    </AdminLayout>
  );
}

function SectionPlaceholder({ heading, description }: { heading: string; description: string }) {
  return (
    <Card className="mx-auto max-w-3xl border border-dashed border-border/70 bg-card/70 text-center">
      <CardHeader>
        <CardTitle className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">{heading}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground/80">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Esta vista estará disponible en la próxima iteración. Mientras tanto, continúa trabajando desde el resumen o el catálogo.
      </CardContent>
    </Card>
  );
}
