import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Code,
  Braces,
  Package,
  FileText,
  FileDown,
  Loader2,
} from 'lucide-react';
import { useBillingStore } from '../store/billing-store';
import { getTemplate } from '../templates';
import {
  renderToHtml,
  renderToJson,
  renderToPlainText,
} from '../lib/exporters';
import { printAsPDF } from '../lib/pdf';

interface ExportMenuProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

interface MenuItem {
  id: string;
  label: string;
  Icon: typeof Code;
  modes?: ('email' | 'web' | 'document')[];
  handler: () => Promise<void>;
}

const fadeInScale = {
  initial: { opacity: 0, scale: 0.96, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: -4 },
};

export function ExportMenu({ showToast }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const mode = useBillingStore((s) => s.mode);
  const payload = useBillingStore((s) => s.payload);

  const run = useCallback(
    async (id: string, fn: () => Promise<void>) => {
      setLoadingId(id);
      try {
        await fn();
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Export failed',
          'error',
        );
      } finally {
        setLoadingId(null);
        setOpen(false);
      }
    },
    [showToast],
  );

  const allItems: MenuItem[] = [
    {
      id: 'copy-html',
      label: 'Copy HTML',
      Icon: Code,
      handler: async () => {
        const html = await renderToHtml(getTemplate(mode, payload));
        await navigator.clipboard.writeText(html);
        showToast('HTML copied to clipboard', 'success');
      },
    },
    {
      id: 'copy-json',
      label: 'Copy JSON',
      Icon: Braces,
      handler: async () => {
        const json = await renderToJson(getTemplate(mode, payload));
        await navigator.clipboard.writeText(
          JSON.stringify(json, null, 2),
        );
        showToast('JSON copied to clipboard', 'success');
      },
    },
    {
      id: 'copy-payload',
      label: 'Copy Payload',
      Icon: Package,
      handler: async () => {
        await navigator.clipboard.writeText(
          JSON.stringify(payload, null, 2),
        );
        showToast('Payload copied to clipboard', 'success');
      },
    },
    {
      id: 'copy-text',
      label: 'Copy Plain Text',
      Icon: FileText,
      modes: ['email'],
      handler: async () => {
        const text = await renderToPlainText(getTemplate(mode, payload));
        await navigator.clipboard.writeText(text);
        showToast('Plain text copied to clipboard', 'success');
      },
    },
    {
      id: 'download-pdf',
      label: 'Download PDF',
      Icon: FileDown,
      modes: ['document'],
      handler: async () => {
        await printAsPDF(getTemplate(mode, payload), payload.invoiceId);
        showToast('PDF ready — check print dialog', 'success');
      },
    },
  ];

  const visibleItems = allItems.filter(
    (item) => !item.modes || item.modes.includes(mode as 'email' | 'web' | 'document'),
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus first item on open
  useEffect(() => {
    if (open) {
      setFocusedIndex(0);
      // Wait for animation
      setTimeout(() => {
        itemRefs.current[0]?.focus();
      }, 60);
    }
  }, [open]);

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (focusedIndex + 1) % visibleItems.length;
      setFocusedIndex(next);
      itemRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev =
        (focusedIndex - 1 + visibleItems.length) % visibleItems.length;
      setFocusedIndex(prev);
      itemRefs.current[prev]?.focus();
    }
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Export menu"
        className={[
          'flex items-center gap-2 px-3 h-8 rounded-md border font-mono text-[11px] uppercase tracking-wider transition-colors',
          open
            ? 'bg-white/[0.10] border-white/[0.15] text-white'
            : 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white',
        ].join(' ')}
      >
        <Download className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
        Export
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="Export options"
            onKeyDown={handleMenuKeyDown}
            variants={fadeInScale}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 z-50 min-w-[240px] rounded-lg border border-white/[0.08] bg-[#0a0a0a] py-1"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
          >
            {visibleItems.map((item, i) => {
              const isLoading = loadingId === item.id;
              const Icon = item.Icon;
              return (
                <button
                  key={item.id}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  role="menuitem"
                  type="button"
                  tabIndex={0}
                  disabled={!!loadingId}
                  onClick={() => run(item.id, item.handler)}
                  onFocus={() => setFocusedIndex(i)}
                  className="flex w-full items-center gap-3 px-3 h-9 text-[13px] text-white/80 transition-colors hover:bg-white/[0.06] active:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2
                      className="w-3.5 h-3.5 animate-spin text-white/40"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : (
                    <Icon
                      className="w-3.5 h-3.5 text-white/40"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
