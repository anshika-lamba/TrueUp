import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
      <Icon
        size={32}
        className="text-white/20"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="mt-4 text-[14px] font-medium text-white/70">{title}</p>
      <p className="mt-2 max-w-[280px] text-[12px] leading-relaxed text-white/40">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 h-8 rounded-md border border-white/[0.08] bg-white/[0.04] px-4 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/[0.06]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
