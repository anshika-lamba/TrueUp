import React from 'react';
import ReactDOMServer from 'react-dom/server';

const FONT_LOAD_TIMEOUT_MS = 300;

export async function printAsPDF(
  element: React.ReactElement,
  invoiceId: string,
): Promise<void> {
  const html = ReactDOMServer.renderToStaticMarkup(element);

  const win = window.open('', '_blank', 'width=900,height=1200');

  if (!win) {
    throw new Error(
      'Unable to open print window. Your browser may be blocking popups for this ' +
        'site — please allow popups and try again.',
    );
  }

  const documentHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${invoiceId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      background: #ffffff;
    }

    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .page-break-before {
      page-break-before: always;
      break-before: page;
    }

    .page-break-after {
      page-break-after: always;
      break-after: page;
    }

    @media print {
      html, body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

  win.document.open();
  win.document.write(documentHtml);
  win.document.close();

  return new Promise<void>((resolve, reject) => {
    try {
      const triggerPrint = () => {
        window.setTimeout(() => {
          win.focus();
          win.print();
          resolve();
        }, FONT_LOAD_TIMEOUT_MS);
      };

      const winDoc = win.document;

      if (winDoc.fonts && typeof winDoc.fonts.ready?.then === 'function') {
        winDoc.fonts.ready.then(triggerPrint).catch(triggerPrint);
      } else {
        triggerPrint();
      }
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Failed to print PDF window.'));
    }
  });
}