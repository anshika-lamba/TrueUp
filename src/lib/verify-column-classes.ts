import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { Row, Column } from '@unlayer/react-elements';
import { VERIFIED_COLUMN_CLASS, VERIFIED_COLUMN_50_CLASS } from './theme';

export interface VerifiedColumnClasses {
  colClass: string;
  col50Class: string;
}

const FALLBACK: VerifiedColumnClasses = {
  colClass: 'u-col',
  col50Class: 'u-col-50',
};

/**
 * Runtime verification that Unlayer's rendered HTML actually uses the
 * expected CSS class names (VERIFIED_COLUMN_CLASS / VERIFIED_COLUMN_50_CLASS).
 * Call this once (e.g. in a dev-only diagnostics route or test) to guard
 * against silent breakage if @unlayer/react-elements changes its output
 * class naming in a future version.
 */
export function verifyColumnClasses(): VerifiedColumnClasses {
  try {
    const markup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        Row,
        null,
        React.createElement(Column, { style: { width: '50%' } }),
      ),
    );

    const classMatches = Array.from(markup.matchAll(/class="([^"]+)"/g)).map(
      (m) => m[1],
    );

    if (classMatches.length === 0) {
      console.warn(
        '[verifyColumnClasses] No class attributes found in rendered Unlayer ' +
          'markup. Falling back to known-good class names.',
      );
      return FALLBACK;
    }

    const allClasses = classMatches.join(' ').split(/\s+/).filter(Boolean);

    const colClass =
      allClasses.find((c) => /^u-col$/.test(c)) ?? allClasses[0] ?? FALLBACK.colClass;

    const col50Class =
      allClasses.find((c) => /50/.test(c)) ?? FALLBACK.col50Class;

    if (colClass !== VERIFIED_COLUMN_CLASS) {
      console.warn(
        `[verifyColumnClasses] Expected column class "${VERIFIED_COLUMN_CLASS}" ` +
          `but found "${colClass}". @unlayer/react-elements may have changed its ` +
          `output class names — check mobileFixCSS in theme.ts.`,
      );
    }

    if (col50Class !== VERIFIED_COLUMN_50_CLASS) {
      console.warn(
        `[verifyColumnClasses] Expected 50%% column class ` +
          `"${VERIFIED_COLUMN_50_CLASS}" but found "${col50Class}". ` +
          `@unlayer/react-elements may have changed its output class names.`,
      );
    }

    return { colClass, col50Class };
  } catch (err) {
    console.warn(
      '[verifyColumnClasses] Failed to render verification markup, falling back ' +
        'to known-good class names.',
      err,
    );
    return FALLBACK;
  }
}