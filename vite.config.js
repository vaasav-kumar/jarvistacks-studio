import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = import.meta.dirname;

// Expands <include src="partials/x.html"></include> tags so every page shares one header, nav and footer.
function htmlPartials() {
  return {
    name: 'html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<include src="([^"]+)"\s*><\/include>/g, (_, src) =>
          readFileSync(resolve(root, src), 'utf8'),
        );
      },
    },
  };
}

const pages = ['index', 'samples', 'pricing', 'contact'];
const demos = readdirSync(resolve(root, 'demos')).filter((f) => f.endsWith('.html'));

export default defineConfig({
  plugins: [htmlPartials()],
  build: {
    rollupOptions: {
      input: {
        ...Object.fromEntries(pages.map((p) => [p, resolve(root, `${p}.html`)])),
        ...Object.fromEntries(demos.map((f) => [`demo-${f.replace('.html', '')}`, resolve(root, 'demos', f)])),
      },
    },
  },
});
