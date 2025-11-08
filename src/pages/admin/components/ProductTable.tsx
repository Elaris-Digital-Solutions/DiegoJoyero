import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Camera, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `product-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export type ProductStatus = 'active' | 'inactive';

export interface ProductRecord {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
}

interface ProductTableProps {
  products: ProductRecord[];
  onCreateProduct: (product: ProductRecord) => void;
  onUpdateProduct: (product: ProductRecord) => void;
  onDeleteProduct: (productId: string) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  isCreateModalOpen: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
}

export function ProductTable({
  products,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  searchTerm,
  onSearch,
  isCreateModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
}: ProductTableProps) {
  const [drafts, setDrafts] = useState<Record<string, ProductRecord>>({});

  useEffect(() => {
    setDrafts((previous) => {
      const next: Record<string, ProductRecord> = {};
      Object.keys(previous).forEach((key) => {
        if (products.some((product) => product.id === key)) {
          next[key] = previous[key];
        }
      });
      return next;
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return products;
    }
    return products.filter((product) => {
      return [product.name, product.category, product.description]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [products, searchTerm]);

  const handleDraftChange = <K extends keyof ProductRecord>(id: string, field: K, value: ProductRecord[K]) => {
    setDrafts((previous) => {
      const base = previous[id] ?? products.find((product) => product.id === id);
      if (!base) return previous;
      return {
        ...previous,
        [id]: {
          ...base,
          [field]: value,
        },
      };
    });
  };

  const handleSaveRow = (id: string) => {
    const draft = drafts[id];
    const original = products.find((product) => product.id === id);
    if (!draft || !original) return;

    onUpdateProduct({ ...draft, updatedAt: new Date().toISOString() });
    setDrafts((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  };

  const handleDeleteRow = (id: string) => {
    onDeleteProduct(id);
    setDrafts((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  };

  const hasDraftChanges = (id: string) => Boolean(drafts[id]);

  return (
    <Card className="min-w-0 border border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Gestión del catálogo
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Edita directamente sobre la tabla y guarda los cambios al instante.
            </CardDescription>
          </div>
          <Button className="gap-2" onClick={onOpenCreateModal}>
            <Plus className="h-4 w-4" />
            Agregar producto
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 min-w-0">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-[320px]">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Buscar por nombre, categoría o descripción"
              className="w-full rounded-lg border border-border/70 bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
            {filteredProducts.length} resultados
          </span>
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-background">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-muted/60 text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Imagen</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No encontramos productos con ese criterio de búsqueda.
                  </td>
                </tr>
              ) : null}
              {filteredProducts.map((product) => {
                const draft = drafts[product.id];
                const current = draft ?? product;
                return (
                  <tr key={product.id} className="align-top hover:bg-muted/40">
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {current.imageUrl ? (
                            <img
                              src={current.imageUrl}
                              alt={current.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Camera className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <input
                          type="url"
                          placeholder="https://"
                          value={current.imageUrl}
                          onChange={(event) => handleDraftChange(product.id, 'imageUrl', event.target.value)}
                          className="w-32 max-w-[8rem] rounded-md border border-border/60 bg-background px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-[220px] max-w-[260px] flex-col gap-2">
                        <input
                          type="text"
                          value={current.name}
                          onChange={(event) => handleDraftChange(product.id, 'name', event.target.value)}
                          className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                        <textarea
                          value={current.description}
                          onChange={(event) => handleDraftChange(product.id, 'description', event.target.value)}
                          rows={2}
                          className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                          placeholder="Descripción breve"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={current.price}
                        onChange={(event) => handleDraftChange(product.id, 'price', Number(event.target.value))}
                        className="w-24 rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="number"
                        min={0}
                        value={current.stock}
                        onChange={(event) => handleDraftChange(product.id, 'stock', Number(event.target.value))}
                        className="w-20 rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="text"
                        value={current.category}
                        onChange={(event) => handleDraftChange(product.id, 'category', event.target.value)}
                        className="w-32 max-w-[8.5rem] rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <select
                        value={current.status}
                        onChange={(event) =>
                          handleDraftChange(product.id, 'status', event.target.value as ProductStatus)
                        }
                        className={cn(
                          'w-32 rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40',
                          current.status === 'active'
                            ? 'text-emerald-600'
                            : 'text-muted-foreground'
                        )}
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          disabled={!hasDraftChanges(product.id)}
                          onClick={() => handleSaveRow(product.id)}
                        >
                          <Save className="h-3.5 w-3.5" />
                          Guardar
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9"
                          onClick={() => handleDeleteRow(product.id)}
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        <div className="space-y-4 md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-card p-6 text-center text-sm text-muted-foreground">
              No encontramos productos con ese criterio de búsqueda.
            </div>
          ) : null}
          {filteredProducts.map((product) => {
            const draft = drafts[product.id];
            const current = draft ?? product;
            return (
              <div key={product.id} className="space-y-3 rounded-xl border border-border/70 bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted">
                      {current.imageUrl ? (
                        <img src={current.imageUrl} alt={current.name} className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={current.name}
                      onChange={(event) => handleDraftChange(product.id, 'name', event.target.value)}
                      className="w-44 rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9"
                    onClick={() => handleDeleteRow(product.id)}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <textarea
                  value={current.description}
                  onChange={(event) => handleDraftChange(product.id, 'description', event.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                  placeholder="Descripción"
                />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Precio
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={current.price}
                      onChange={(event) => handleDraftChange(product.id, 'price', Number(event.target.value))}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Stock
                    <input
                      type="number"
                      min={0}
                      value={current.stock}
                      onChange={(event) => handleDraftChange(product.id, 'stock', Number(event.target.value))}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Categoría
                    <input
                      type="text"
                      value={current.category}
                      onChange={(event) => handleDraftChange(product.id, 'category', event.target.value)}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Estado
                    <select
                      value={current.status}
                      onChange={(event) =>
                        handleDraftChange(product.id, 'status', event.target.value as ProductStatus)
                      }
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </label>
                </div>
                <Button
                  size="sm"
                  className="w-full gap-2"
                  variant="outline"
                  disabled={!hasDraftChanges(product.id)}
                  onClick={() => handleSaveRow(product.id)}
                >
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>

      <AddProductModal
        open={isCreateModalOpen}
        onClose={onCloseCreateModal}
        onSubmit={(product) => {
          onCreateProduct(product);
          onCloseCreateModal();
        }}
      />
    </Card>
  );
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: ProductRecord) => void;
}

function AddProductModal({ open, onClose, onSubmit }: AddProductModalProps) {
  const [form, setForm] = useState<Omit<ProductRecord, 'id'>>({
    name: '',
    description: '',
    price: 0,
    stock: 1,
    category: '',
    status: 'active',
    imageUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: '',
        description: '',
        price: 0,
        stock: 1,
        category: '',
        status: 'active',
        imageUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: undefined,
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    onSubmit({
      id: createId(),
      ...form,
      name: trimmedName,
      category: form.category.trim() || 'Sin categoría',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border/80 bg-background shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg tracking-[0.22em]">Nuevo producto</h2>
              <p className="text-sm text-muted-foreground">
                Completa los datos principales para mostrarlo en el catálogo digital.
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Nombre del producto
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Ej. Anillo Petra"
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Categoría
              <input
                type="text"
                value={form.category}
                onChange={(event) => handleChange('category', event.target.value)}
                placeholder="Anillos, Aros, Pulseras"
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground sm:col-span-2">
              Descripción
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                rows={4}
                placeholder="Describe materiales, inspiración o detalles clave."
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Precio (S/)
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(event) => handleChange('price', Number(event.target.value))}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Stock disponible
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => handleChange('stock', Number(event.target.value))}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Estado
              <select
                value={form.status}
                onChange={(event) => handleChange('status', event.target.value as ProductStatus)}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              URL de la imagen principal
              <input
                type="url"
                value={form.imageUrl}
                onChange={(event) => handleChange('imageUrl', event.target.value)}
                placeholder="https://..."
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </label>
          </div>

          <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="sm:w-auto">
              Guardar producto
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
