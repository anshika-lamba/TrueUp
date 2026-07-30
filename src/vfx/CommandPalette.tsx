import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, LayoutGrid, FileText, Flame, Database, Wifi, Search } from 'lucide-react';
import { useBillingStore } from '../store/billing-store';
import { presets } from '../data/presets';
import type { ArtifactMode } from '../data/types';
import { EASE_OUT, DURATION_FAST } from './motion';

interface Command {
  id: string;
  label: string;
  group: 'View' | 'Scenario';
  icon: typeof Mail;
  action: () => void;
}

const PRESET_ICON: Record<string, typeof Flame> = {
  token_spike: Flame,
  db_surge: Database,
  bandwidth_cap: Wifi,
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  const setMode = useBillingStore((s) => s.setMode);
  const setPreset = useBillingStore((s) => s.setPreset);

  const commands: Command[] = useMemo(
    () => [
      {
        id: 'view-email',
        label: 'View Alert Email',
        group: 'View',
        icon: Mail,
        action: () => setMode('email' as ArtifactMode),
      },
      {
        id: 'view-web',
        label: 'View In-App Portal',
        group: 'View',
        icon: LayoutGrid,
        action: () => setMode('web' as ArtifactMode),
      },
      {
        id: 'view-doc',
        label: 'View PDF Invoice',
        group: 'View',
        icon: FileText,
        action: () => setMode('document' as ArtifactMode),
      },
      ...presets.map((p) => ({
        id: `preset-${p.key}`,
        label: `Load Scenario · ${p.label}`,
        group: 'Scenario' as const,
        icon: PRESET_ICON[p.key],
        action: () => setPreset(p.key, p.payload),
      })),
    ],
    [setMode, setPreset]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K to toggle
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery('');
        setActiveIdx(0);
      }
      // Escape to close
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      e.preventDefault();
      filtered[activeIdx].action();
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            className="fixed left-1/2 top-[20%] z-[101] w-full max-w-[560px] -translate-x-1/2 px-4"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
          >
            <div
              className="rounded-xl bg-[#0a0a0a] shadow-level-3-highlight overflow-hidden gpu"
              onKeyDown={handleKeyDown}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 h-12 border-b border-white/[0.06]">
                <Search
                  className="w-4 h-4 text-white/40 shrink-0"
                  strokeWidth={2}
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-body text-white placeholder:text-white/30 focus:outline-none"
                />
                <kbd className="text-micro text-white/40 font-mono uppercase tracking-wider">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-body-sm text-white/40">
                    No matching commands
                  </div>
                ) : (
                  filtered.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const active = idx === activeIdx;
                    return (
                      <button
                        key={cmd.id}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => {
                          cmd.action();
                          setOpen(false);
                        }}
                        className={
                          'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ' +
                          (active
                            ? 'bg-white/[0.06] text-white'
                            : 'text-white/70')
                        }
                      >
                        <Icon
                          className="w-4 h-4 shrink-0 text-white/50"
                          strokeWidth={2}
                        />
                        <span className="flex-1 text-body-sm font-medium tracking-tight">
                          {cmd.label}
                        </span>
                        <span className="font-mono text-micro text-white/30 uppercase tracking-wider">
                          {cmd.group}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 h-8 border-t border-white/[0.06] font-mono text-[10px] text-white/30 uppercase tracking-wider">
                <span>
                  <kbd className="text-white/50">↑↓</kbd> Navigate
                </span>
                <span>
                  <kbd className="text-white/50">↵</kbd> Run
                </span>
                <span>
                  {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}