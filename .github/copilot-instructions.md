# Copilot / AI agent instructions for this repo

Purpose: give AI coding agents the immediate context and commands needed to be productive editing and testing this Gatsby website.

High-level architecture
- This is a Gatsby v5 static site (React) with a mix of TypeScript (`.ts`, `.tsx`) and JS files. Key runtime files:
  - `gatsby-config.ts`, `gatsby-node.ts` — site setup and build hooks.
  - `gatsby-browser.js`, `gatsby-ssr.js` — browser/SSR customizations.
  - `src/` — site source: components, pages, templates, utils.
  - `src/templates/` contains page templates: `post.tsx`, `scientific-post.tsx`, `post-list.tsx`, `tag-list.tsx`.

Content/data flows & patterns
- Content is Markdown-first: posts under `blog/YYYY/`, standalone pages under `pages/`, and project entries under `projects/`.
- Routing comes from frontmatter + `gatsby-node.ts`:
  - `type: "blog"` / `type: "projects"` produce list + detail pages.
  - `type: "page"` with `page: "slug"` creates a custom page path (example: `pages/about.md`).
- Images & static assets:
  - Use `static/` for direct public files (for example `static/img/...`).
  - Use relative images in Markdown when appropriate (for example project-local `./images/...`).
  - Do not hand-edit `public/`; it is generated output.
- Plugins: custom remark/mermaid helper exists under `plugins/gatsby-remark-mermaid/` — follow its style when adding local plugins.

Developer workflows (commands)
- Install deps: run `npm install` (repo uses npm).
- Node runtime is pinned in `.node-version` (`20`).
- Local dev: `npm run develop` (runs `gatsby develop`).
- Build: `npm run build` (runs `gatsby build`).
- Serve built site locally: `npm run serve` (runs `gatsby serve`).
- Clean cache/build artifacts: `npm run clean` (runs `gatsby clean`).
- Format code: `npm run format` (uses Prettier over `js`, `jsx`, `ts`, `tsx`, `json`, and `md`).
- Tests: `npm test` is a placeholder that exits with error — there are no unit tests committed.

Project-specific conventions
- Mixed TS/JS: config/build hooks are TypeScript (`.ts`) while some boot files are plain JS — preserve file extensions when editing.
- Use Gatsby data-layer patterns: GraphQL queries in templates/components and data injected via `gatsby-node.ts`.
- Tailwind + PostCSS: styling uses Tailwind (`tailwindcss` v4) and `postcss.config.js`; keep Tailwind utility classes for styles.
- Images: use `gatsby-plugin-image`/`gatsby-plugin-sharp` patterns already established in templates; prefer the project's image helpers where present.

Integration points & external deps
- Gatsby plugins listed in `package.json` provide most integrations (images, remark, mermaid, manifest, offline). Modify `gatsby-config.ts` to change plugin behavior.
- Third-party services: Google fonts via `gatsby-plugin-google-fonts`. No other external API integrations are present in repo files.

What to edit for common tasks (examples)
- Add a new blog post: create `blog/YYYY/YYYY-MM-DD-title.md` with frontmatter; the `post.tsx` template will render it.
- Add a markdown page: create `pages/<name>.md` with frontmatter including `type: "page"` and `page: "<slug>"`.
- Add a React page: create a page component under `src/pages/` for framework-routed pages.
- Change site metadata: edit `gatsby-config.ts`.
- Add a component: place presentational components in `src/components/` and import them in templates/pages.

Quick debugging notes
- Run `npm run develop` and open `http://localhost:8000` for the site, and `http://localhost:8000/___graphql` for GraphiQL to inspect GraphQL nodes.
- When troubleshooting builds, try `npm run clean` then `npm run build` to eliminate stale cache issues.

Where to look for examples
- Example post: `blog/2020/2020-07-03-honlsoft-v2.md` (frontmatter + markdown usage).
- Templates: `src/templates/post.tsx`, `src/templates/post-list.tsx` show GraphQL usage and rendering patterns.
- Site config: `gatsby-config.ts`, build hooks: `gatsby-node.ts`.

If something in this file is unclear or you'd like more detail (CLI examples, Node version, or coverage of a particular template), tell me which area to expand.
