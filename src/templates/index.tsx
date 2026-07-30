import * as React from 'react';
import type { ArtifactMode, BillingPayload } from '../data/types';

import AlertEmail from './alert-email';
import PortalPage from './portal-page';
import InvoiceDoc from './invoice-doc';

export { AlertEmail, PortalPage, InvoiceDoc };

export const TEMPLATE_REGISTRY: Record<ArtifactMode, string> = {
  email: 'alert-email',
  web: 'portal-page',
  document: 'invoice-doc',
};

export function getTemplate(mode: ArtifactMode, payload: BillingPayload): React.ReactElement {
  if (mode === 'email') {
    return <AlertEmail payload={payload} />;
  }
  if (mode === 'web') {
    return <PortalPage payload={payload} />;
  }
  return <InvoiceDoc payload={payload} />;
}
