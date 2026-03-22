import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vitepress"

export default defineConfig({
  lang: "en-US",
  title: "Honlsoft",
  titleTemplate: ":title | Honlsoft",
  description: "A personal and software development blog.",
  appearance: false,
  cleanUrls: true,
  outDir: "public",
  srcDir: "content",
  ignoreDeadLinks: "localhostLinks",
  lastUpdated: true,
  assetsDir: "static",
  rewrites(id) {
    return id.replace(/^blog\/[^/]+\//, "blog/")
  },
  transformPageData(pageData) {
    return pageData 
  },
  head: [
    ["link", { rel: "icon", href: "/img/honlsoft.svg", type: "image/svg+xml" }],
    ["meta", { property: "og:title", content: "Honlsoft" }],
    ["meta", { property: "og:description", content: "A personal and software development blog." }],
    ["meta", { property: "og:image", content: "https://www.honlsoft.com/img/honlsoft-thumbnail.jpg" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;600;700&family=Oswald:wght@500;700&display=swap",
      },
    ],
  ],
  markdown: {
    config(md) {
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() === "mermaid") {
          return `<div class="mermaid">${md.utils.escapeHtml(token.content)}</div>`
        }

        return defaultFence
          ? defaultFence(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
      }
    },
  },
  themeConfig: {
    logo: "/img/honlsoft.svg",
    nav: [
      { text: "Blog", link: "/blog/" },
      { text: "Projects", link: "/projects/" },
      { text: "About", link: "/about" },
      { text: "Links", link: "/links" },
      { text: "Fitness", link: "/fitness-2025" },
    ],
    search: {
      provider: "local",
    },
    outline: {
      level: [2, 3],
    },
    docFooter: {
      prev: false,
      next: false,
    },
    socialLinks: [{ icon: "github", link: "https://github.com/jerhon/honlsoft-v2" }],
    footer: {
      message: "Built with VitePress and Markdown.",
      copyright: "Copyright © Jeremy Honl",
    },
  },
  vite: {
    plugins: [tailwindcss()],
    publicDir: "static",
  },
})
