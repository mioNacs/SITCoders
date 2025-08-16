import DOMPurify from "dompurify";
import { marked } from "marked";

// Modern API: use marked.use + token-based renderer functions
marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    link({ href, title, tokens }) {
      // Convert child inline tokens to HTML (the link text)
      const text = this.parser.parseInline(tokens) || (href ?? "link");
      const safeHref = href || "#";
      const t = title ? ` title="${title}"` : "";
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer"${t}>${text}</a>`;
    },
  },
});

export function renderSafeMarkdown(input) {
  const src = typeof input === "string" ? input : "";
  const html = marked.parse(src);
  return DOMPurify.sanitize(html, {
  ADD_ATTR: ["target", "rel"], // keep target/rel
});
}
