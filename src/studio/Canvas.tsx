import { useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle } from 'lucide-react';
import { useBillingStore } from '../store/billing-store';
import { getCanvasWidth } from '../lib/layout';
import { getTemplate } from '../templates';
import { ErrorBoundary } from '../vfx/ErrorBoundary';
import { EASE_OUT, DURATION_BASE } from '../vfx/motion';

const MODE_ELEMENT: Record<string, string> = {
  email: 'Email',
  web: 'Page',
  document: 'Document',
};

export default function Canvas() {
  const mode = useBillingStore((s) => s.mode);
  const viewport = useBillingStore((s) => s.viewport);
  const payload = useBillingStore((s) => s.payload);

  const canvasWidth = getCanvasWidth(mode, viewport);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fix A5: reset scroll position when mode changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [mode]);

  return (
    <div
      ref={scrollRef}
      className="relative flex-1 overflow-y-auto overflow-x-auto min-w-0 bg-background"
    >
      <div
        className="relative flex flex-col items-center py-10 px-6"
        style={{ minHeight: '100%' }}
      >
        {/* Sticky viewport metadata pill */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION_BASE, ease: EASE_OUT }}
          className="sticky top-0 z-20 mb-8 flex items-center gap-3 px-3 py-1.5 rounded-full shadow-level-2 bg-[#0a0a0a]/90 backdrop-blur-md"
          aria-hidden="true"
        >
          <Circle className="w-1.5 h-1.5 fill-foreground text-foreground" />
          <span className="font-mono text-micro text-foreground tracking-wider">
            &lt;{MODE_ELEMENT[mode]}/&gt;
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-foreground-subtle" />
          <span className="font-mono text-micro text-foreground-muted tnum tracking-wider">
            {canvasWidth}PX
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-foreground-subtle" />
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-foreground tracking-widest">
            <Circle className="w-1 h-1 fill-foreground text-foreground animate-pulse" />
            LIVE
          </span>
        </motion.div>

        {/* Template frame */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: DURATION_BASE, ease: EASE_OUT }}
            className="relative"
            style={{ width: `${canvasWidth}px`, maxWidth: '100%' }}
            data-pdf-ready={mode === 'document' ? 'true' : undefined}
          >
            <div
              className="relative rounded-xl overflow-hidden shadow-level-3"
              style={{
                backgroundColor: mode === 'web' ? '#09090b' : '#ffffff',
              }}
            >
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="w-full h-96 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    </div>
                  }
                >
                  {getTemplate(mode, payload)}
                </Suspense>
              </ErrorBoundary>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <p className="mt-8 mb-4 text-center font-mono text-micro text-foreground-subtle tracking-wider">
          RENDERED FROM UNIFIED &lt;EMAIL/PAGE/DOCUMENT&gt; TREE
        </p>
      </div>
    </div>
  );
}