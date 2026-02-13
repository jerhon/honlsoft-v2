# Design Guidelines

This document outlines the core design systems and implementation standards for the Honlsoft v2 Gatsby repository.

## Design Philosophy

- **Use Simplicity**: Keep styles minimal and functional.
- **Content-First**: Typography and layout serve readability.
- **Component-Driven**: Use reusable React components; avoid inline styles.
- **Utility-First**: Leverage Tailwind CSS for layout and styling.

## Technology Stack

- **Framework**: Gatsby (Static Site Generator)
- **UI Library**: React (TypeScript/JavaScript)
- **Styling**: Tailwind CSS v4 + PostCSS
- **Layout**: Component-based layout (Header, Footer, Content Area)
- **Fonts**: Google Fonts (Lato, Montserrat, Roboto, Open Sans) + System Fonts (Times New Roman for Scientific)

## Color Palette

Defined as CSS variables in `src/styles/global.css`:

| Variable | Hex Value | Usage |
| :--- | :--- | :--- |
| `--color-primary` | `#0d47a1` | Primary branding (Blueish) |
| `--color-secondary` | `#b71c1c` | Secondary/Accent (Reddish) |
| `--color-menu` | `#000000de` | Navigation Background |
| `--color-highlight` | `#e8e8e0` | Subtle Background Highlights |
| `--color-white` | `#ffffff` | Backgrounds, Text on Dark |
| `--color-black` | `#000000` | Text, Structural Elements |

## Typography

Fonts are imported via `gatsby-browser.js` or `gatsby-config.ts` (Google Fonts plugin).

### Families
- **Title / Headings**: `Lato`, sans-serif (`--font-title`)
- **Body Text**: `Montserrat`, sans-serif (`--font-sans`)
- **Logo / Brand**: `Oswald` (`--font-logo`)
- **Technical Articles**: `Roboto`, sans-serif
- **Scientific Articles**: `Times New Roman`, serif (LaTeX emulation)

### Usage Guidelines
1.  **Headings (`h1`-`h6`)**: Use `--font-title`. Tailwind classes: `text-3xl` (h1), `text-2xl` (h2), `text-xl` (h3).
2.  **Body**: Use `--font-sans` for interface text; article content font respects the chosen template.
3.  **Code**: Monospace font (system default or defined in PrismJS theme).

## Layout & Components

### Global Layout
The `Layout` component wraps all pages (`src/components/layout/layout.tsx`). It provides:
-   **Header**: Navigation and Branding.
-   **Footer**: Copyright and Links.
-   **SEO**: Metadata injection.
-   **Main Content**: Renders `children`.

### Templates
Content follows specific templates tailored to the format:

1.  **Standard/Technical Post** (`src/templates/post.tsx`):
    *   Uses `technical-article` CSS class.
    *   Optimized for software engineering tutorials.
    *   Features syntax highlighting, readable line-height, and `Roboto` font.

2.  **Scientific Post** (`src/templates/scientific-post.tsx`):
    *   Uses `scientific-article` CSS class.
    *   Emulates academic papers/LaTeX.
    *   Features serif font (`Times New Roman`), justified text, numbered sections.
    *   Triggered via frontmatter: `template: "scientific"`.

## Styling Workflow (Tailwind v4)

1.  **Global Styles**: `src/styles/global.css` contains the `@theme` definitions and imports.
2.  **Component Styling**:
    *   Prefer utility classes: `<div className="p-4 bg-gray-100 rounded">`.
    *   Avoid creating new CSS classes unless repeating a complex pattern >3 times.
    *   Use `@apply` in CSS files sparingly (e.g., for markdown content that can't take utility classes directly).
3.  **Responsive Design**:
    *   **Mobile First**: Write base styles for mobile, add breakpoints for larger screens.
    *   **Breakpoints**:
        *   `md`: Tablet/Small Laptop
        *   `lg` / `--breakpoint-laptop`: 1024px
        *   `xl` / `--breakpoint-desktop`: 1280px

## Imagery and Media

-   **Optimization**: Use `gatsby-plugin-image` components (`StaticImage`, `GatsbyImage`) where possible.
-   **Location**:
    *   **Content Images**: Store relative to the Markdown file (e.g., `./images/screenshot.png`).
    *   **Static Assets**: Store in `static/img/` for public access if not processed by Gatsby.
-   **Style**: Images in articles should generally be centered and responsive (`max-w-full`).

## Markdown Content

-   **Headings**: Follow strict hierarchy (`#` Title -> `##` Section -> `###` Subsection).
-   **Code Blocks**: Use triple backticks with language identifier (e.g., \`\`\`typescript).
-   **Diagrams**: Use MermaidJS blocks for flowcharts/sequences (rendered by `gatsby-remark-mermaid`).

## Contribution Checklist

- [ ] Does the new component use existing Tailwind utilities?
- [ ] Are colors using the CSS variables?
- [ ] Is typography consistent with the intended template (Technical vs Scientific)?
- [ ] Is the layout responsive on mobile?
