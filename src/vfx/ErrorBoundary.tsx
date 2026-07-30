import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useBillingStore } from '../store/billing-store';
import { samplePayload } from '../data/sample';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Inner reset button needs store access, so we wrap outside the class.
function ResetButton() {
  const setPayload = useBillingStore((s) => s.setPayload);
  return (
    <button
      type="button"
      onClick={() => setPayload(samplePayload)}
      className="h-9 px-4 rounded-md bg-white text-black text-[13px] font-semibold transition-colors hover:bg-white/90"
    >
      Reset payload
    </button>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error } = this.state;

    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <div className="flex max-w-[400px] flex-col items-center text-center">
          <AlertTriangle
            size={40}
            className="text-rose-400"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h2 className="mt-6 text-[20px] font-semibold text-white">
            Template render failed
          </h2>
          {error && (
            <pre className="mt-3 max-h-[100px] w-full overflow-y-auto rounded bg-black/40 p-3 text-left font-mono text-[12px] text-white/60">
              {error.message}
            </pre>
          )}
          <div className="mt-8 flex gap-3">
            <ResetButton />
            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(
                  error?.stack ?? error?.message ?? 'Unknown error',
                )
              }
              className="h-9 px-4 rounded-md border border-white/20 bg-transparent text-[13px] text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              Copy error
            </button>
          </div>
        </div>
      </div>
    );
  }
}
