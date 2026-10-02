---
name: site-design-system
description: "Use when editing the Honlsoft VitePress site's CSS, Vue component styling, layout, typography, colors, blog post lists, archives, navigation, or responsive design. Follow the current light editorial design system and check the relevant theme styles before changing UI."
---

# Honlsoft Site Design System

Use this skill for visual changes to the VitePress site. The site takes cues from shadcn's restrained surfaces and controls, but uses Vue, VitePress, Tailwind v4, and locally owned CSS modules; it does not install or render React shadcn components.

## Source of Truth

- `.vitepress/theme/custom.css`: shared color tokens, site background, tag pills, and archive cards.
- `.vitepress/theme/tailwind.css`: Tailwind import and the shared `hs-page-width` container (1200px maximum).
- `.vitepress/theme/components/sections/SiteNavbar.module.css`: sticky header, desktop links, and mobile overlay.
- `.vitepress/theme/components/sections/HeroSection.module.css`: homepage introduction and featured story.
- `.vitepress/theme/components/PostList.module.css`: shared blog, recent-post, and project lists.
- `.vitepress/theme/components/layouts/BlogArticleLayout.module.css`: article header, prose, code, tags, and outline.
- `.vitepress/theme/components/layouts/PageLayout.vue`: Markdown page heading and lead styling for archive pages.

Read the owning component's CSS module before changing its presentation. Prefer updating an existing token or module over adding broad overrides in `custom.css`. Keep the custom VitePress layout and content routing intact.

## Visual Language

- Content-first and editorial: generous breathing room, clear type hierarchy, visible dividers, and minimal decoration. Do not turn each page section into a floating card.
- Light neutral surfaces: page `#fafbf9`, secondary surface `#f1f5f2`, elevated surface white, and dividers `#dae4df`. The homepage introduction uses `#f1f5f4` as a full-width band.
- Deep green for text and interaction: primary text `#192d29`, secondary `#4f625d`, muted `#697b75`, brand `#176c5b`, brand-soft `#e4f1ec`. A subdued terracotta (`#a6503b`) appears on select hover states. Prefer the `--vp-c-*` tokens in `custom.css` where they exist.
- Typography: Montserrat for interface/body text; Lato for prominent headings and article titles; Oswald for the wordmark. Article prose is about 1.06rem with a 1.78 line height. Headings use balanced wrapping, not negative letter spacing.
- Restrained geometry: 5-6px corners for pills, buttons, and individual cards; fine 1px borders; very soft shadows only where a surface needs separation. No dark gradients, oversized corner radii, blurred orbs, or ornamental card stacks.
- Links and controls: green text or pale-green backgrounds, with readable hover and focus states. Keep accessible focus outlines and reduced-motion behavior where animation is used.

## Layout Patterns

- The shared container is `hs-page-width` (max 1200px), with responsive horizontal padding on its caller. Avoid full-width prose or hard-coded viewport widths.
- Homepage: a two-column introduction and latest story on desktop; the latest-story panel is hidden below 760px so recent writing appears early on mobile. A short entry animation has a reduced-motion fallback.
- Post lists: use rows divided by hairlines, not repeated cards. Desktop places a quiet, sentence-case date (or project thumbnail) beside the title and excerpt; below 960px the row stacks. The title is the emphasis, the date is `--vp-c-text-3`, and the arrow is visible on touch-sized layouts. `PostList` is shared by homepage, blog archive, projects, and related posts.
- Article pages: a spacious title and metadata above unframed reading content; a thin rule starts the body. The outline is a simple left-border aside on larger screens, hidden below 1024px. Inline code uses a pale surface; fenced code remains dark for contrast.
- Archive pages: a prominent heading and short lead, followed by a list or compact tag directory. Tags and pagination use bordered, lightly tinted controls; pagination stays in normal document flow.
- Navbar: sticky, light, and separated by a bottom border; compact desktop links and an overlay menu on mobile. Do not add a second competing page navigation.

## Editing And Verification

1. Identify the owning Vue component and CSS module; check `custom.css` for reusable tokens and its neighboring responsive rules.
2. Make the smallest style change that works at desktop and mobile widths. Preserve the article and scientific content behavior, real project images, and existing navigation interactions.
3. Run `npm run build` for shared layout, content, or asset changes. With `npm run dev` running, inspect the affected page in the integrated browser at desktop and narrow mobile widths; check contrast, text wrapping, horizontal overflow, and interactive states.
