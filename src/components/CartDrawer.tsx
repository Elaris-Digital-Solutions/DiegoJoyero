import { X } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md border-l transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--cardBg)', borderColor: 'var(--border)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.45em]" style={{ color: 'var(--textSecondary)' }}>
              Tu selección
            </p>
            <h2 id="cart-title" className="text-2xl font-display" style={{ color: 'var(--text)' }}>
              Carrito
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 border border-transparent hover:border-[var(--border)]"
            aria-label="Cerrar carrito"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text)' }} />
          </button>
        </div>

        <div className="px-8 py-10 space-y-6">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
            Aún no hay piezas en tu carrito. Selecciona una pieza para reservarla y coordinar una cita privada.
          </p>
          <a
            href="/#collection"
            className="inline-block text-xs uppercase tracking-[0.45em] border-b border-transparent hover:border-[var(--primary)]"
            style={{ color: 'var(--primary)' }}
          >
            Explorar colección
          </a>
        </div>
      </aside>
    </div>
  );
}
