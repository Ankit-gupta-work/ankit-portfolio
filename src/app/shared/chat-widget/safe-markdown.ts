/**
 * A tiny, intentionally narrow markdown renderer for assistant chat replies.
 * It escapes all HTML first, then re-introduces exactly three safe constructs:
 * **bold**, "- " list items (grouped into <ul>), and [text](url) links that
 * open in a new tab. Nothing else is ever turned into a tag, so the result
 * is always safe to bind via [innerHTML].
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isSafeUrl(url: string): boolean {
  return /^(https?:|mailto:)/i.test(url.trim());
}

function renderInline(escaped: string): string {
  let html = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label: string, url: string) => {
    if (!isSafeUrl(url)) return escapeHtml(match);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  return html;
}

export function renderSafeMarkdown(raw: string): string {
  const escaped = escapeHtml(raw);
  const lines = escaped.split('\n');
  const htmlParts: string[] = [];
  let inList = false;

  for (const line of lines) {
    const listMatch = /^-\s+(.*)$/.exec(line);
    if (listMatch) {
      if (!inList) {
        htmlParts.push('<ul>');
        inList = true;
      }
      htmlParts.push(`<li>${renderInline(listMatch[1])}</li>`);
      continue;
    }

    if (inList) {
      htmlParts.push('</ul>');
      inList = false;
    }

    if (line.trim().length === 0) {
      htmlParts.push('<br>');
    } else {
      htmlParts.push(`<p>${renderInline(line)}</p>`);
    }
  }

  if (inList) htmlParts.push('</ul>');

  return htmlParts.join('');
}
