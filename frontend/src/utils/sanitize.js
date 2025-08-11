import DOMPurify from "dompurify";
import { marked } from "marked";

// Configure marked to treat single newlines as <br>, enable GFM
const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
  const t = title ? ` title="${title}"` : "";
  return `<a href="${href}" target="_blank" rel="noopener noreferrer"${t}>${text}</a>`;
};

marked.setOptions({
  gfm: true,
  breaks: true, // key: single newlines => <br>
  renderer,
});

/**
 * Turn user text into sanitized HTML with Markdown + safe links.
 */
export function renderSafeMarkdown(input) {
  const src = typeof input === "string" ? input : "";
  const html = marked.parse(src || "");
  return DOMPurify.sanitize(html);
}
