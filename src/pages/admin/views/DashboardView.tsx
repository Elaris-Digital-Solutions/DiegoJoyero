import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
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
import type { ProductInput, ProductRecord } from '../components/ProductTable';
import { ActivityFeed } from '../components/ActivityFeed';
import type { ActivityItem, ActivityAction } from '../components/ActivityFeed';
import { useTheme } from '../../../contexts/ThemeContext';
import { supabase, type Product } from '../../../lib/supabase';

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

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const generateProductId = (
  name: string,
  material: ProductInput['material'],
  existingIds: Set<string>
) => {
  const sanitizedName = slugify(name) || 'pieza';
  const base = `${material}-${sanitizedName}`;
  let candidate = base;
  let suffix = 1;

  while (existingIds.has(candidate)) {
    candidate = `${base}-${suffix++}`;
  }

  existingIds.add(candidate);
  return candidate;
};

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


export function DashboardView() {
  const location = useLocation();
  const section = resolveSection(location.pathname);
  const { theme } = useTheme();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [hasInitializedActivities, setHasInitializedActivities] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const mapFromSupabase = useCallback(
    (product: Product): ProductRecord => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price ?? 0),
      stock: Number(product.stock ?? 0),
      category: product.category ?? 'Sin categoría',
      material: product.material === 'silver' ? 'silver' : 'gold',
      status: (product.status ?? 'active') as ProductRecord['status'],
      featured: Boolean(product.featured),
      imageUrl: product.image_url ?? '',
      createdAt: product.created_at ?? new Date().toISOString(),
      updatedAt: product.updated_at ?? product.created_at ?? new Date().toISOString(),
    }),
    []
  );

  const buildInitialActivities = useCallback((records: ProductRecord[]): ActivityItem[] => {
    return records.slice(0, 6).map((item) => ({
      id: createId(),
      action: 'create',
      title: `${item.name} registrado`,
      description: `Ingresó a la categoría ${item.category}.`,
      timestamp: formatRelativeTime(item.createdAt),
    }));
  }, []);

  const fetchProducts = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!supabase) {
        setError('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
        setLoading(false);
        return false;
      }

      if (!silent) {
        setLoading(true);
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('material', theme)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const records = (data ?? []).map(mapFromSupabase);
        setProducts(records);

        if (!hasInitializedActivities) {
          setActivities(buildInitialActivities(records));
          setHasInitializedActivities(true);
        }

        setError(null);
        return true;
      } catch (fetchError) {
        console.error('Error fetching products', fetchError);
        setProducts([]);
        setError('No se pudo cargar el catálogo desde Supabase.');
        return false;
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [buildInitialActivities, hasInitializedActivities, mapFromSupabase, theme]
  );

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setActivities([]);
    setHasInitializedActivities(false);
  }, [theme]);

  const sortByCreatedAtDesc = useCallback((records: ProductRecord[]) => {
    return [...records].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, []);

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
    setActivities((previous) => {
      const next: ActivityItem[] = [
        {
          id: createId(),
          action,
          title,
          description,
          timestamp: formatRelativeTime(new Date().toISOString()),
        },
        ...previous,
      ];
      return next.slice(0, 25);
    });
  };

  const handleCreateProduct = async (payload: ProductInput) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado.');
    }

    const nowIso = new Date().toISOString();
  const existingIds = new Set(products.map((product) => product.id));
  const productId = generateProductId(payload.name, payload.material, existingIds);
    const insertPayload = {
      id: productId,
      name: payload.name,
      description: payload.description,
      price: payload.price,
      stock: payload.stock,
      category: payload.category,
      material: payload.material,
      image_url: payload.imageUrl,
      featured: payload.featured,
      status: payload.status,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(insertPayload)
      .select()
      .single<Product>();

    if (error || !data) {
      throw error ?? new Error('No se pudo crear el producto.');
    }

    const record = mapFromSupabase(data);
    if (record.material === theme) {
      setProducts((previous) => sortByCreatedAtDesc([record, ...previous]));
    }
    handleAddActivity('create', 'Nuevo producto publicado', `${record.name} está disponible en el catálogo.`);
    setError(null);
    await fetchProducts({ silent: true });
  };

  const handleUpdateProduct = async (updatedProduct: ProductRecord) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado.');
    }

    const { id, ...rest } = updatedProduct;
    const updatePayload = {
      name: rest.name,
      description: rest.description,
      price: rest.price,
      stock: rest.stock,
      category: rest.category,
      material: rest.material,
      image_url: rest.imageUrl,
      featured: rest.featured,
      status: rest.status,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single<Product>();

    if (error || !data) {
      throw error ?? new Error('No se pudo actualizar el producto.');
    }

    const record = mapFromSupabase(data);
    setProducts((previous) => {
      const withoutCurrent = previous.filter((product) => product.id !== id);
      if (record.material !== theme) {
        return withoutCurrent;
      }
      return sortByCreatedAtDesc([record, ...withoutCurrent]);
    });
    handleAddActivity('update', 'Ficha de producto actualizada', `${record.name} fue editado desde el panel.`);
    setError(null);
    await fetchProducts({ silent: true });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!supabase) {
      throw new Error('Supabase no está configurado.');
    }

    const removedProduct = products.find((product) => product.id === productId);
    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      throw error;
    }

    setProducts((previous) => previous.filter((product) => product.id !== productId));
    if (removedProduct) {
      handleAddActivity('delete', 'Producto eliminado', `${removedProduct.name} se ocultó del catálogo.`);
    }
    setError(null);
    await fetchProducts({ silent: true });
  };

  const handleImportProducts = () => {
    if (isImporting) return;
    if (!supabase) {
      setError('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
      return;
    }
    importInputRef.current?.click();
  };

  const parseCsv = (content: string): ProductInput[] => {
    const normalize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0000-\u001F]/g, '')
        .replace(/[\u0300-\u036f]/g, '');

    const detectDelimiter = (line: string): string => {
      const candidates: string[] = [',', ';', '\t'];
      let detected: string = ',';
      let maxCount = 0;

      candidates.forEach((candidate) => {
        const count = line.split(candidate).length - 1;
        if (count > maxCount) {
          detected = candidate;
          maxCount = count;
        }
      });

      return maxCount > 0 ? detected : ',';
    };

    const splitLine = (line: string, delimiter: string): string[] => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let index = 0; index < line.length; index += 1) {
        const char = line[index];

        if (char === '"') {
          if (inQuotes && line[index + 1] === '"') {
            current += '"';
            index += 1;
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }

        if (char === delimiter && !inQuotes) {
          values.push(current.trim());
          current = '';
          continue;
        }

        current += char;
      }

      values.push(current.trim());

      return values.map((entry) => entry.replace(/^"|"$/g, '').trim());
    };

    const toMaterial = (raw: string): ProductInput['material'] => {
      const normalized = normalize(raw).toLowerCase();
      if (!normalized) return theme;
      if (normalized.includes('plata') || normalized.includes('silver')) return 'silver';
      if (normalized.includes('oro') || normalized.includes('gold')) return 'gold';
      return theme;
    };

    const toStatus = (raw: string): ProductInput['status'] => {
      const normalized = normalize(raw).toLowerCase();
      if (normalized === 'inactivo' || normalized === 'inactive') return 'inactive';
      return 'active';
    };

    const toFeatured = (raw: string): boolean => {
      const normalized = normalize(raw).toLowerCase();
      return normalized === 'si' || normalized === 'sí' || normalized === 'true' || normalized === '1';
    };

    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length <= 1) return [];

    const delimiter = detectDelimiter(lines[0]);

    const headers = splitLine(lines[0], delimiter)
      .map((header) => normalize(header).trim().toLowerCase());
    const nameIndex = headers.findIndex((header) => header === 'nombre' || header === 'name');
    if (nameIndex === -1) return [];

    const descriptionIndex = headers.findIndex((header) => header === 'descripcion' || header === 'description');
    const priceIndex = headers.findIndex((header) => header === 'precio' || header === 'price');
    const stockIndex = headers.findIndex((header) => header === 'stock');
    const categoryIndex = headers.findIndex((header) => header === 'categoria' || header === 'category');
    const statusIndex = headers.findIndex((header) => header === 'estado' || header === 'status');
    const imageIndex = headers.findIndex((header) => header === 'imagen' || header === 'image' || header === 'imageurl');
    const materialIndex = headers.findIndex((header) => header === 'material');
    const featuredIndex = headers.findIndex((header) => header === 'destacado' || header === 'featured');

    const entries: ProductInput[] = [];

    lines.slice(1).forEach((line) => {
      const values = splitLine(line, delimiter);
      const name = values[nameIndex];
      if (!name) return;

      const priceRaw = priceIndex >= 0 ? values[priceIndex] ?? '0' : '0';
      const price = Number(priceRaw.replace(/[^0-9.,]/g, '').replace(',', '.'));
      const stockRaw = stockIndex >= 0 ? values[stockIndex] ?? '0' : '0';
      const stock = Number(stockRaw.replace(/[^0-9.,-]/g, '').replace(',', '.'));
      const statusRaw = statusIndex >= 0 ? values[statusIndex] ?? 'active' : 'active';
      const materialRaw = materialIndex >= 0 ? values[materialIndex] ?? theme : theme;
      const featuredRaw = featuredIndex >= 0 ? values[featuredIndex] ?? 'false' : 'false';

      entries.push({
        name,
        description: descriptionIndex >= 0 ? values[descriptionIndex] ?? '' : '',
        price: Number.isFinite(price) ? price : 0,
        stock: Number.isFinite(stock) ? stock : 0,
        category:
          categoryIndex >= 0 && values[categoryIndex]
            ? values[categoryIndex]
            : 'Sin categoría',
        status: toStatus(statusRaw),
        imageUrl: imageIndex >= 0 ? values[imageIndex] ?? '' : '',
        material: toMaterial(materialRaw),
        featured: toFeatured(featuredRaw),
      });
    });

    return entries;
  };

  const importProducts = async (entries: ProductInput[]) => {
    if (!supabase) {
      setError('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (entries.length === 0) {
      return;
    }

    setIsImporting(true);
    try {
      const existingIds = new Set(products.map((product) => product.id));
      const payload = entries.map((entry) => ({
        id: generateProductId(entry.name, entry.material, existingIds),
        name: entry.name,
        description: entry.description,
        price: entry.price,
        stock: entry.stock,
        category: entry.category,
        material: entry.material,
        image_url: entry.imageUrl,
        featured: entry.featured,
        status: entry.status,
      }));

      const { data, error } = await supabase.from('products').insert(payload).select();

      if (error) {
        throw error;
      }

      const inserted = (data ?? []).map(mapFromSupabase);
      const relevantInserted = inserted.filter((product) => product.material === theme);
      if (relevantInserted.length > 0) {
        setProducts((previous) => {
          const existingIds = new Set(relevantInserted.map((product) => product.id));
          const remaining = previous.filter((product) => !existingIds.has(product.id));
          return sortByCreatedAtDesc([...relevantInserted, ...remaining]);
        });
      }
      handleAddActivity('import', 'Productos importados', `${inserted.length} producto(s) se añadieron desde Excel/CSV.`);
      setError(null);
    } catch (importError) {
      console.error('Error importing products', importError);
      setError('La importación desde Excel/CSV no se pudo completar. Revisa el formato del archivo.');
      throw importError;
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const text = String(reader.result ?? '');
      const importedProducts = parseCsv(text);
      if (importedProducts.length === 0) {
        handleAddActivity('import', 'Importación sin cambios', 'No se detectaron filas válidas en el archivo.');
      } else {
        try {
          await importProducts(importedProducts);
        } catch {
          handleAddActivity('import', 'Importación con errores', 'Hubo problemas al procesar el archivo.');
        }
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSyncInventory = async () => {
    if (isSyncing || loading) return;
    if (!supabase) {
      setError('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setIsSyncing(true);
    try {
      const success = await fetchProducts();
      if (success) {
        handleAddActivity('update', 'Sincronización completada', 'El inventario se actualizó con los datos de la tienda.');
      }
    } finally {
      setIsSyncing(false);
    }
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
        {error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <QuickActions
          onCreateProduct={() => setIsCreateModalOpen(true)}
          onImportProducts={handleImportProducts}
          onSyncInventory={() => void handleSyncInventory()}
          isImporting={isImporting}
          isSyncing={isSyncing}
        />
        <ProductTable
          products={products}
          isLoading={loading}
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
        {error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
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
