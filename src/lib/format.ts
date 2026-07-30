// All functions in this module are pure and side-effect free.

export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    compact: boolean = false,
  ): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: compact && Math.abs(amount) >= 1000 ? 'compact' : 'standard',
      maximumFractionDigits: compact && Math.abs(amount) >= 1000 ? 1 : 2,
    });
    return formatter.format(amount);
  }
  
  export function formatNumber(n: number, compact: boolean = false): string {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: compact && Math.abs(n) >= 1000 ? 'compact' : 'standard',
      maximumFractionDigits: compact && Math.abs(n) >= 1000 ? 1 : 0,
    });
    return formatter.format(n);
  }
  
  export function formatPercent(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }
  
  export function calcUsagePercent(used: number, limit: number): number {
    if (limit === 0) return 0;
    return (used / limit) * 100;
  }
  
  export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
    const defaultOpts: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Date(iso);
    return new Intl.DateTimeFormat('en-US', { ...defaultOpts, ...opts }).format(date);
  }
  
  export function formatDateShort(iso: string): string {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
  
  export function formatPeriod(start: string, _end: string): string {
    const date = new Date(start);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  }
  
  export function formatUnitPrice(price: number, unit: string): string {
    if (price < 0.001) {
      return `$${(price * 1_000_000).toFixed(2)} / 1M ${unit}`;
    }
    if (price < 0.01) {
      return `$${(price * 1_000).toFixed(2)} / 1K ${unit}`;
    }
    return `$${price.toFixed(4)} / ${unit}`;
  }