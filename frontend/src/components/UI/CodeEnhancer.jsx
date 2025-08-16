import React from 'react';
// Global markdown + Prism styles
import "github-markdown-css/github-markdown.css";
import "prismjs/themes/prism.css";
// Prism plugins CSS
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

// Prism core and languages
import Prism from 'prismjs';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-sql';

// Prism plugins (must be imported after languages)
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/show-language/prism-show-language';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';

/**
 * CodeEnhancer
 * Adds Prism highlighting, line numbers, language label, copy, and collapse/expand for long blocks.
 * Mount once at app root.
 */
export default function CodeEnhancer() {
  React.useEffect(() => {
    // Register a toolbar button to toggle collapse for long code blocks (>6 lines)
    if (Prism.plugins.toolbar && !Prism.plugins.toolbar._sitVerseCollapseRegistered) {
      Prism.plugins.toolbar._sitVerseCollapseRegistered = true;
      Prism.plugins.toolbar.registerButton('toggle-collapse', function (env) {
        try {
          const pre = env.element?.parentElement;
          if (!pre || pre.tagName.toLowerCase() !== 'pre') return;
          const lineCount = (env.code || '').split(/\r?\n/).length;
          if (lineCount <= 6) return; // only for long blocks
          pre.classList.add('collapsible', 'collapsed');

          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'prism-toolbar-button prism-toggle';
          button.textContent = 'Expand';
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('title', 'Expand/Collapse code');
          button.addEventListener('click', () => {
            const isCollapsed = pre.classList.toggle('collapsed');
            const expanded = !isCollapsed;
            button.textContent = expanded ? 'Collapse' : 'Expand';
            button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          });
          return button;
        } catch (_) {
          return undefined;
        }
      });
    }

    const detectLang = (text) => {
      const t = (text || '').trim();
      if (!t) return 'none';
      // Basic heuristics for common inline snippets
      if (/^</.test(t) || /<\/?[a-zA-Z]/.test(t)) return 'markup';
      if (/\b(const|let|var|function|=>|console\.|return|import |export )/.test(t)) return 'javascript';
      if (/\b(def |import |print\(|lambda\b)/.test(t)) return 'python';
      if (/\{[\s\S]*\}|;/.test(t)) return 'javascript';
      if (/^\{[\s\S]*\}$/.test(t)) return 'json';
      if (/^\$ |^(npm|yarn|pnpm) /.test(t)) return 'bash';
      return 'none';
    };

    const enhanceUnder = (root) => {
      const selection = Array.from(document.querySelectorAll('.markdown-body'));
      const containers = root ? [root] : (selection.length ? selection : [document]);
      containers.forEach((container) => {
        if (!container) return;
        const blockCodes = container.querySelectorAll('pre > code');
        blockCodes.forEach((codeEl) => {
          const pre = codeEl.parentElement;
          if (!pre || pre.dataset.prismized === '1') return;

          // Ensure language class exists (try to detect if missing)
          if (![...codeEl.classList].some(c => c.startsWith('language-'))) {
            const lang = detectLang(codeEl.textContent);
            codeEl.classList.add(lang === 'none' ? 'language-text' : `language-${lang}`);
          }

          // Add line numbers class before highlighting so plugin can attach
          pre.classList.add('line-numbers');

          // Highlight and let plugins (toolbar, show-language, copy, line-numbers) run
          Prism.highlightElement(codeEl);

          // Add an identifying class to the Copy button so we can style with an icon
          try {
            const codeToolbar = pre.parentElement; // .code-toolbar
            const toolbar = codeToolbar?.querySelector('.toolbar');
            const copyBtn = toolbar?.querySelector('button');
            if (copyBtn && !copyBtn.dataset.iconified) {
              // Heuristic: if it's the copy button from plugin, it usually has text Copy/Copied!
              const t = (copyBtn.textContent || '').toLowerCase();
              if (t.includes('copy')) {
                copyBtn.classList.add('with-copy-icon');
                copyBtn.dataset.iconified = '1';
              }
            }
          } catch {}

          pre.dataset.prismized = '1';
        });

        // Inline code highlighting (not inside <pre>)
        const inlineCodes = container.querySelectorAll('code:not(pre > code)');
        inlineCodes.forEach((codeEl) => {
          if (codeEl.dataset.prismized === '1') return;
          if (![...codeEl.classList].some(c => c.startsWith('language-'))) {
            const lang = detectLang(codeEl.textContent);
            codeEl.classList.add(lang === 'none' ? 'language-markup' : `language-${lang}`);
          }
          Prism.highlightElement(codeEl);
          codeEl.dataset.prismized = '1';
        });
      });
    };

    // Initial pass
    enhanceUnder();

    // Observe DOM changes to re-apply on dynamic content
    const observer = new MutationObserver((mutations) => {
      let shouldRun = false;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length > 0) {
          shouldRun = true; break;
        }
      }
      if (shouldRun) enhanceUnder();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null; // no UI; effect-only component
}
