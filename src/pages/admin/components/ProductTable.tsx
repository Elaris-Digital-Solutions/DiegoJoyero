import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { Camera, Loader2, Plus, Save, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
import { productImageConstraints, uploadProductImage } from '../../../lib/storage';

export type ProductStatus = 'active' | 'inactive';

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  material: 'gold' | 'silver';
  status: ProductStatus;
  featured: boolean;
  imageUrl: string;
}

export interface ProductRecord extends ProductInput {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

interface ProductTableProps {
  products: ProductRecord[];
  isLoading: boolean;
  onCreateProduct: (product: ProductInput) => Promise<void>;
  onUpdateProduct: (product: ProductRecord) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  searchTerm: string;
  onSearch: (term: string) => void;
  isCreateModalOpen: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
}

export function ProductTable({
  products,
  isLoading,
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
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadingImageIds, setUploadingImageIds] = useState<Record<string, boolean>>({});
  const [imageUploadTargetId, setImageUploadTargetId] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const imageFileAccept = productImageConstraints.allowedMimeTypes.join(',');
  const maxImageSizeMb = Math.round(productImageConstraints.maxSizeBytes / (1024 * 1024));
  const imageHelpText = `Formatos: JPG, PNG, WebP o AVIF (máx. ${maxImageSizeMb} MB).`;

  const handleNumericFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

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

  const handleOpenImagePicker = (id: string) => {
    setSubmitError(null);
    setImageUploadTargetId(id);
    uploadInputRef.current?.click();
  };

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';
    const productId = imageUploadTargetId;
    if (!file || !productId) {
      setImageUploadTargetId(null);
      return;
    }

    const base = drafts[productId] ?? products.find((product) => product.id === productId);
    if (!base) {
      setImageUploadTargetId(null);
      return;
    }

    setSubmitError(null);
    setUploadingImageIds((previous) => ({ ...previous, [productId]: true }));

    try {
      const { publicUrl } = await uploadProductImage(file, base.material);
      handleDraftChange(productId, 'imageUrl', publicUrl);
    } catch (error) {
      console.error('Error uploading product image', error);
      const message = error instanceof Error ? error.message : 'No se pudo subir la imagen. Intenta nuevamente.';
      setSubmitError(message);
    } finally {
      setUploadingImageIds((previous) => {
        const next = { ...previous };
        delete next[productId];
        return next;
      });
      setImageUploadTargetId(null);
    }
  };

  const isUploadingImage = (id: string) => Boolean(uploadingImageIds[id]);

  const handleSaveRow = async (id: string) => {
    const draft = drafts[id];
    const original = products.find((product) => product.id === id);
    if (!draft || !original) return;
    setSubmitError(null);
    setSavingIds((previous) => ({ ...previous, [id]: true }));
    try {
      await onUpdateProduct({ ...draft, updatedAt: new Date().toISOString() });
      setDrafts((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error('Error updating product', error);
      setSubmitError('No se pudieron guardar los cambios. Intenta nuevamente.');
    } finally {
      setSavingIds((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    }
  };

  const handleDeleteRow = async (id: string) => {
    setSubmitError(null);
    setDeletingIds((previous) => ({ ...previous, [id]: true }));
    try {
      await onDeleteProduct(id);
      setDrafts((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error('Error deleting product', error);
      setSubmitError('No se pudo eliminar el producto. Intenta nuevamente.');
    } finally {
      setDeletingIds((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    }
  };

  const hasDraftChanges = (id: string) => Boolean(drafts[id]);
  const isSaving = (id: string) => Boolean(savingIds[id]);
  const isDeleting = (id: string) => Boolean(deletingIds[id]);
  const resultsLabel = isLoading ? 'Cargando…' : `${filteredProducts.length} resultados`;

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
          <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">{resultsLabel}</span>
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-background">
            <table className="w-full min-w-[1024px] text-left text-sm">
              <thead className="bg-muted/60 text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Imagen</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Destacado</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
              {isLoading && filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Cargando catálogo…
                  </td>
                </tr>
              ) : null}
              {!isLoading && filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-muted-foreground">
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
                      <div className="flex flex-col items-start gap-2">
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
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleOpenImagePicker(product.id)}
                            disabled={isUploadingImage(product.id)}
                          >
                            {isUploadingImage(product.id) ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <UploadCloud className="h-3.5 w-3.5" />
                            )}
                            {isUploadingImage(product.id) ? 'Subiendo…' : 'Subir imagen'}
                          </Button>
                          {current.imageUrl ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDraftChange(product.id, 'imageUrl', '')}
                            >
                              Quitar
                            </Button>
                          ) : null}
                        </div>
                        <p className="text-[0.65rem] text-muted-foreground">{imageHelpText}</p>
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
                        onFocus={handleNumericFocus}
                        className="w-24 rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="number"
                        min={0}
                        value={current.stock}
                        onChange={(event) => handleDraftChange(product.id, 'stock', Number(event.target.value))}
                        onFocus={handleNumericFocus}
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
                        value={current.material}
                        onChange={(event) =>
                          handleDraftChange(product.id, 'material', event.target.value as ProductRecord['material'])
                        }
                        className="w-32 rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="gold">Oro</option>
                        <option value="silver">Plata</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <select
                        value={current.featured ? 'true' : 'false'}
                        onChange={(event) =>
                          handleDraftChange(product.id, 'featured', event.target.value === 'true')
                        }
                        className="w-28 rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="true">Destacado</option>
                        <option value="false">Regular</option>
                      </select>
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
                          className="gap-2"
                          disabled={!hasDraftChanges(product.id) || isSaving(product.id)}
                          onClick={() => void handleSaveRow(product.id)}
                        >
                          {isSaving(product.id) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Save className="h-3.5 w-3.5" />
                          )}
                          {isSaving(product.id) ? 'Guardando' : 'Guardar'}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9"
                          onClick={() => void handleDeleteRow(product.id)}
                          aria-label="Eliminar producto"
                          disabled={isSaving(product.id) || isDeleting(product.id)}
                        >
                          {isDeleting(product.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
          {isLoading && filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-card p-6 text-center text-sm text-muted-foreground">
              Cargando catálogo…
            </div>
          ) : null}
          {!isLoading && filteredProducts.length === 0 ? (
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
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://"
                      value={current.imageUrl}
                      onChange={(event) => handleDraftChange(product.id, 'imageUrl', event.target.value)}
                      className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 sm:w-auto"
                        onClick={() => handleOpenImagePicker(product.id)}
                        disabled={isUploadingImage(product.id)}
                      >
                        {isUploadingImage(product.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UploadCloud className="h-4 w-4" />
                        )}
                        {isUploadingImage(product.id) ? 'Subiendo…' : 'Subir imagen'}
                      </Button>
                      {current.imageUrl ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="w-full sm:w-auto"
                          onClick={() => handleDraftChange(product.id, 'imageUrl', '')}
                        >
                          Quitar imagen
                        </Button>
                      ) : null}
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground">{imageHelpText}</p>
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
                      onFocus={handleNumericFocus}
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
                      onFocus={handleNumericFocus}
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
                    Material
                    <select
                      value={current.material}
                      onChange={(event) =>
                        handleDraftChange(product.id, 'material', event.target.value as ProductRecord['material'])
                      }
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="gold">Oro</option>
                      <option value="silver">Plata</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Destacado
                    <select
                      value={current.featured ? 'true' : 'false'}
                      onChange={(event) => handleDraftChange(product.id, 'featured', event.target.value === 'true')}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
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
                  disabled={!hasDraftChanges(product.id) || isSaving(product.id)}
                  onClick={() => void handleSaveRow(product.id)}
                >
                  {isSaving(product.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving(product.id) ? 'Guardando' : 'Guardar cambios'}
                </Button>
              </div>
            );
          })}
        </div>
        {submitError ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}
      </CardContent>

      <input
        ref={uploadInputRef}
        type="file"
        accept={imageFileAccept}
        className="hidden"
        onChange={handleImageFileChange}
      />

      <AddProductModal
        open={isCreateModalOpen}
        onClose={onCloseCreateModal}
        onSubmit={async (product) => {
          setSubmitError(null);
          try {
            await onCreateProduct(product);
            onCloseCreateModal();
          } catch (error) {
            console.error('Error creating product', error);
            setSubmitError('No se pudo crear el producto. Revisa los datos e inténtalo nuevamente.');
          }
        }}
      />
    </Card>
  );
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: ProductInput) => Promise<void>;
}

function AddProductModal({ open, onClose, onSubmit }: AddProductModalProps) {
  type AddProductFormState = Omit<ProductInput, 'price' | 'stock'> & {
    price: string;
    stock: string;
  };

  const [form, setForm] = useState<AddProductFormState>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    status: 'active',
    imageUrl: '',
    material: 'gold',
    featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageFileAccept = productImageConstraints.allowedMimeTypes.join(',');
  const maxImageSizeMb = Math.round(productImageConstraints.maxSizeBytes / (1024 * 1024));
  const imageHelpText = `Formatos: JPG, PNG, WebP o AVIF (máx. ${maxImageSizeMb} MB).`;

  const handleNumericFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  useEffect(() => {
    if (open) {
      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        status: 'active',
        imageUrl: '',
        material: 'gold',
        featured: false,
      });
      setErrorMessage(null);
      setIsSubmitting(false);
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  if (!open) return null;

  const handlePickImage = () => {
    setErrorMessage(null);
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';
    if (!file) {
      return;
    }

    setErrorMessage(null);
    setIsUploadingImage(true);
    try {
      const { publicUrl } = await uploadProductImage(file, form.material);
      setForm((previous) => ({
        ...previous,
        imageUrl: publicUrl,
      }));
    } catch (error) {
      console.error('Error uploading modal image', error);
      const message = error instanceof Error ? error.message : 'No se pudo subir la imagen. Intenta nuevamente.';
      setErrorMessage(message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleChange = <K extends keyof AddProductFormState>(field: K, value: AddProductFormState[K]) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const parsedPrice = Number.parseFloat(form.price.replace(',', '.'));
      const parsedStock = Number.parseInt(form.stock, 10);
      const sanitizedPrice = Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0;
      const sanitizedStock = Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : 0;

      await onSubmit({
        ...form,
        name: trimmedName,
        category: form.category.trim() || 'Sin categoría',
        price: sanitizedPrice,
        stock: sanitizedStock,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting product modal', error);
      setErrorMessage('No se pudo guardar el producto. Verifica los campos e inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
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

          <input
            ref={fileInputRef}
            type="file"
            accept={imageFileAccept}
            className="hidden"
            onChange={handleImageFileChange}
          />

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
                onChange={(event) => handleChange('price', event.target.value)}
                onFocus={handleNumericFocus}
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
                onChange={(event) => handleChange('stock', event.target.value)}
                onFocus={handleNumericFocus}
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
              Material
              <select
                value={form.material}
                onChange={(event) => handleChange('material', event.target.value as ProductInput['material'])}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="gold">Oro</option>
                <option value="silver">Plata</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Destacado en la web
              <select
                value={form.featured ? 'true' : 'false'}
                onChange={(event) => handleChange('featured', event.target.value === 'true')}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Imagen principal
              <div className="space-y-2">
                {form.imageUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted">
                      <img src={form.imageUrl} alt={form.name || 'Producto'} className="h-full w-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleChange('imageUrl', '')}
                    >
                      Quitar imagen
                    </Button>
                  </div>
                ) : null}
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) => handleChange('imageUrl', event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={handlePickImage}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UploadCloud className="h-3.5 w-3.5" />
                    )}
                    {isUploadingImage ? 'Subiendo…' : 'Subir imagen'}
                  </Button>
                </div>
                <p className="text-[0.7rem] lowercase tracking-normal text-muted-foreground">
                  {imageHelpText}
                </p>
              </div>
            </label>
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Guardando…' : 'Guardar producto'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
