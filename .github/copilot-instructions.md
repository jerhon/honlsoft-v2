# Copilot / AI agent instructions for this repo

Purpose: give AI coding agents the immediate context and commands needed to be productive editing and testing this VitePress website.

High-level architecture

- This is a VitePress static site with a custom theme under `.vitepress/`.
- Key runtime/config files:
  - `.vitepress/config.mts` — site configuration, routing rewrites, Markdown config, theme config, and Vite options.
  - `.vitepress/theme/index.ts` — theme entry; extends the default VitePress theme, imports global styles, and registers custom Vue components.
  - `.vitepress/theme/Layout.vue` — top-level layout shell that renders the site navbar, page content, and Mermaid initialization.
  - `.vitepress/theme/` — shared CSS, Vue components, and data loaders.
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
  - The site logo lives at `static/img/honlsoft.svg` and is used in the navbar and homepage hero.
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
- Keep layout responsibilities separated:
  - `.vitepress/theme/Layout.vue` should stay thin.
  - Put navbar/header behavior in `.vitepress/theme/components/SiteNavbar.vue`.
  - Put page- or article-specific presentation into dedicated components such as `HeroSection.vue` or `BlogArticleLayout.vue`.
- If you need build-time content indexes or derived metadata, use VitePress data loaders in `.vitepress/theme/data/`.
- Mermaid diagrams are supported through the Markdown fence override in `.vitepress/config.mts` and client-side initialization in `.vitepress/theme/Layout.vue`.
- Tailwind CSS is available in the theme through `.vitepress/theme/tailwind.css`, and repo-specific shared styling lives in `.vitepress/theme/custom.css`.
- Prefer CSS modules for component-owned styling. Current examples include `HeroSection.module.css`, `BlogArticleLayout.module.css`, and `SiteNavbar.module.css`.
- Preserve the `extends: DefaultTheme` setup in `.vitepress/theme/index.ts` unless the user explicitly wants to replace the default VitePress base styles and behavior.

Integration points & external deps

- Core runtime dependencies are `vitepress`, `vue`, `mermaid`, and `chart.js`.
- Running charts for the fitness pages use JSON data in `.vitepress/theme/data/`.
- Google Fonts are configured via `head` entries in `.vitepress/config.mts`.
- No external API integrations are wired into the site build at the moment.

What to edit for common tasks (examples)

- Add a new blog post: create `content/blog/YYYY/YYYY-MM-DD-title.md`.
- Add a new project page: create `content/projects/<slug>.md`.
- Add a new standalone page: create `content/<slug>.md`.
- Add or change the global shell or theme registration: edit `.vitepress/theme/index.ts` and/or `.vitepress/theme/Layout.vue`.
- Add or change navbar behavior or styling: edit `.vitepress/theme/components/SiteNavbar.vue` and `.vitepress/theme/components/SiteNavbar.module.css`.
- Add or change homepage hero presentation: edit `.vitepress/theme/components/HeroSection.vue` and `HeroSection.module.css`.
- Add or change blog article presentation defaults: edit `.vitepress/theme/components/BlogArticleLayout.vue` and `BlogArticleLayout.module.css`.
- Change routing or site metadata: edit `.vitepress/config.mts`.
- Add a new tag-driven behavior: update `content/tag/[slug].paths.ts` and/or the theme data loaders/components.

Quick debugging notes

- Run `npm run develop` and open the local VitePress dev server URL shown in the terminal.
- Run `npm run build` after routing, data-loader, layout, or asset-path changes to catch dead links and asset resolution issues.
- If relative links break after moving content, remember that links inside Markdown should match the final rewritten route structure when VitePress rewrites are in play.

Where to look for examples

- Example post: `content/blog/2020/2020-07-03-honlsoft-v2.md`
- Theme entry and component registration: `.vitepress/theme/index.ts`
- Theme layout shell and Mermaid handling: `.vitepress/theme/Layout.vue`
- Site navbar and responsive overlay menu: `.vitepress/theme/components/SiteNavbar.vue`
- Homepage hero styling and logo placement: `.vitepress/theme/components/HeroSection.vue`
- Blog article layout and typography defaults: `.vitepress/theme/components/BlogArticleLayout.vue`
- Blog/project metadata loaders: `.vitepress/theme/data/posts.data.ts`, `.vitepress/theme/data/projects.data.ts`
- Dynamic tag routing: `content/tag/[slug].md`, `content/tag/[slug].paths.ts`
- Site config and rewrites: `.vitepress/config.mts`

If something in this file is unclear or you'd like more detail, tell me which area to expand.

CSS Styling

- Tailwind CSS v4 is available for styling components and content. Use utility classes in Vue components or Markdown as needed.
- Prefer CSS modules for component-specific styles in `.vitepress/theme/components/` when styles are complex or need to be scoped. For example, `HeroSection.vue` uses `HeroSection.module.css`