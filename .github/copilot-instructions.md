# Copilot / AI agent instructions for this repo

Purpose: give AI coding agents the immediate context and commands needed to be productive editing and testing this VitePress website.

High-level architecture

- This is a VitePress static site with a custom theme under `.vitepress/`.
- Key runtime/config files:
  - `.vitepress/config.mts` — site configuration, routing rewrites, Markdown config, theme config, and Vite options.
  - `.vitepress/theme/` — custom theme entry, layout overrides, shared CSS, Vue components, and data loaders.
  - `content/` — the VitePress source directory for site content.
- Content structure under `content/`:
  - `content/blog/YYYY/` — blog posts grouped by year.
  - `content/projects/` — project writeups plus the projects index page.
  - `content/tag/` — tag listing plus the dynamic tag route template and paths loader.
  - `content/*.md` — top-level pages such as `index.md`, `about.md`, `links.md`, and the fitness pages.

Content/data flows & patterns

- Content is Markdown-first and VitePress renders it directly.
- Blog URLs are intentionally flattened to `/blog/<slug>` even though files live in `content/blog/YYYY/`. This is handled by the `rewrites` function in `.vitepress/config.mts`; preserve that behavior unless the user asks to change URLs.
- Projects render from `content/projects/*.md` and keep `/projects/<slug>` paths.
- Tag pages are generated from `content/tag/[slug].md` + `content/tag/[slug].paths.ts`.
- Shared content metadata is built through VitePress data loaders in `.vitepress/theme/data/`.
- Images and static assets:
  - Use `static/` for files that should be served directly from the site root (for example `static/img/...`).
  - Use relative paths for content-local assets when the asset belongs with the Markdown content (for example `./images/...` or `../images/...` under `content/`).
  - Do not hand-edit `public/`; it is generated output.

Developer workflows (commands)

- Install deps: `npm install`
- Node runtime is pinned in `.node-version` (`20`).
- Local dev: `npm run develop` or `npm run dev` (runs `vitepress dev`)
- Build: `npm run build` (runs `vitepress build`)
- Preview built site locally: `npm run serve` (runs `vitepress preview`)
- Clean build artifacts: `npm run clean`
- Format code/content: `npm run format`
- Tests: `npm test` is only a placeholder message; there are no committed automated tests.

Project-specific conventions

- Keep application code for the site in `.vitepress/` and source content in `content/`.
- Prefer editing Markdown content directly rather than introducing framework code unless the page truly needs behavior or interactivity.
- If you add interactive UI, put Vue components in `.vitepress/theme/components/`.
- If you need build-time content indexes or derived metadata, use VitePress data loaders in `.vitepress/theme/data/`.
- Mermaid diagrams are supported through the Markdown fence override in `.vitepress/config.mts` and client-side initialization in `.vitepress/theme/Layout.vue`.
- Tailwind CSS is available in the theme through `.vitepress/theme/tailwind.css`, and repo-specific styling still lives in `.vitepress/theme/custom.css`.

Integration points & external deps

- Core runtime dependencies are `vitepress`, `vue`, `mermaid`, and `chart.js`.
- Running charts for the fitness pages use JSON data in `.vitepress/theme/data/`.
- Google Fonts are configured via `head` entries in `.vitepress/config.mts`.
- No external API integrations are wired into the site build at the moment.

What to edit for common tasks (examples)

- Add a new blog post: create `content/blog/YYYY/YYYY-MM-DD-title.md`.
- Add a new project page: create `content/projects/<slug>.md`.
- Add a new standalone page: create `content/<slug>.md`.
- Add or change theme behavior: edit files under `.vitepress/theme/`.
- Change routing or site metadata: edit `.vitepress/config.mts`.
- Add a new tag-driven behavior: update `content/tag/[slug].paths.ts` and/or the theme data loaders/components.

Quick debugging notes

- Run `npm run develop` and open the local VitePress dev server URL shown in the terminal.
- Run `npm run build` after routing, data-loader, or content moves to catch dead links and asset resolution issues.
- If relative links break after moving content, remember that links inside Markdown should match the final rewritten route structure when VitePress rewrites are in play.

Where to look for examples

- Example post: `content/blog/2020/2020-07-03-honlsoft-v2.md`
- Theme layout and page chrome: `.vitepress/theme/Layout.vue`
- Blog/project metadata loaders: `.vitepress/theme/data/posts.data.ts`, `.vitepress/theme/data/projects.data.ts`
- Dynamic tag routing: `content/tag/[slug].md`, `content/tag/[slug].paths.ts`
- Site config and rewrites: `.vitepress/config.mts`

If something in this file is unclear or you'd like more detail, tell me which area to expand.
