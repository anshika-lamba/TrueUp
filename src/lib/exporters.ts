import React from 'react';
import ReactDOMServer from 'react-dom/server';

// NOTE: @unlayer/react-elements@0.1.20 does NOT export renderToHtml,
// renderToJson, renderToPlainText, or registerTool. All export
// functionality below is implemented via ReactDOMServer directly.

export async function renderToHtml(element: React.ReactElement): Promise<string> {
  return ReactDOMServer.renderToStaticMarkup(element);
}

export async function renderToJson(element: React.ReactElement): Promise<object> {
  // Serializes the React element tree. Symbols (e.g. $$typeof) are
  // dropped automatically by JSON.stringify, which is acceptable here
  // since this is a debug/inspection export, not a round-trippable format.
  return JSON.parse(JSON.stringify(element));
}

export async function renderToPlainText(element: React.ReactElement): Promise<string> {
  let html = ReactDOMServer.renderToStaticMarkup(element);

  // 1. Strip <style> blocks
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 2. Strip <script> blocks
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // 3. Replace block-level closing tags with newlines before stripping
  html = html.replace(/<\/(p|div|tr|li)>/gi, '\n');

  // 4. Strip all remaining HTML tags
  let text = html.replace(/<[^>]+>/g, '');

  // 5. Collapse whitespace (but preserve single newlines as breaks)
  text = text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 0)
    .join('\n');

  // 6. Trim result
  return text.trim();
}