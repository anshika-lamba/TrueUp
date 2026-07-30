import type { BillingPayload, UsageMetric } from '../data/types';
import { calcUsagePercent } from '../lib/format';

export function synthesizeNarrative(payload: BillingPayload): string {
  const overages = payload.metrics.filter((m) => calcUsagePercent(m.used, m.limit) >= 100);
  const nearLimits = payload.metrics.filter((m) => {
    const pct = calcUsagePercent(m.used, m.limit);
    return pct >= 80 && pct < 100;
  });

  if (overages.length === 0 && nearLimits.length === 0) {
    return 'Your usage is perfectly on track for this billing cycle. No anomalies detected.';
  }

  const chunks: string[] = [];
  
  if (overages.length > 0) {
    const topOverage = overages.sort((a, b) => 
      calcUsagePercent(b.used, b.limit) - calcUsagePercent(a.used, a.limit)
    )[0];
    const pct = calcUsagePercent(topOverage.used, topOverage.limit);
    chunks.push(`Your bill is unusually high because ${topOverage.label} spiked to ${pct.toFixed(0)}% of your allowed limits, incurring overage charges.`);
  }

  if (nearLimits.length > 0 && overages.length === 0) {
    const topNear = nearLimits.sort((a, b) => 
      calcUsagePercent(b.used, b.limit) - calcUsagePercent(a.used, a.limit)
    )[0];
    chunks.push(`You have elevated usage this cycle. Specifically, ${topNear.label} is nearing its limit and may cause overage fees if trends continue.`);
  }

  return chunks.join(' ');
}
