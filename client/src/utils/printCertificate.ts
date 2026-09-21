/**
 * Utility to print or save a certificate element as a strictly 1-page,
 * full-color landscape document without any app sidebars, headers, or buttons.
 */
export const printIsolatedCertificate = (element: HTMLElement, documentTitle: string) => {
  // Remove any previously existing print iframe
  const existingIframe = document.getElementById('kinya-print-frame');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'kinya-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  // Gather all style elements and links from current page
  let styles = '';
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
    styles += node.outerHTML;
  });

  const printCss = `
    <style>
      @page {
        size: landscape;
        margin: 0;
      }
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        box-sizing: border-box;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        background-color: #051108 !important;
        color: #f1f5f9 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .print-wrapper {
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        padding: 16px !important;
        margin: 0 auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        background-color: #051108 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .cert-content {
        width: 100% !important;
        max-width: 1060px !important;
        max-height: 96vh !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        overflow: hidden !important;
      }
    </style>
  `;

  // Clone node so we don't disturb the live DOM
  const cloned = element.cloneNode(true) as HTMLElement;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="rw">
      <head>
        <meta charset="utf-8" />
        <title>${documentTitle}</title>
        ${styles}
        ${printCss}
      </head>
      <body style="background-color: #051108 !important;">
        <div class="print-wrapper">
          <div class="cert-content">
            ${cloned.outerHTML}
          </div>
        </div>
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      iframe.remove();
    }, 2500);
  }, 400);
};
