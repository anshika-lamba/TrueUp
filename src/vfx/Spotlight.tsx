import { useEffect, useRef, type ReactNode } from 'react';

interface SpotlightProps {
  children: ReactNode;
  className?: string;
}

/**
 * High-performance mouse-tracking spotlight.
 * Uses CSS variables directly on the DOM to avoid React re-renders.
 */
export default function Spotlight({ children, className = '' }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    };

    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={ref} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}