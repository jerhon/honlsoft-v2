import { createContentLoader } from "vitepress"

import { slugFromUrl, stripHtml, type ContentCard } from "../lib/content"

declare const data: ContentCard[]
export { data }

export default createContentLoader("blog/**/*.md", {
  excerpt: true,
  transform(rawData): ContentCard[] {
    return rawData
      .filter(page => page.frontmatter.type === "blog")
      .map(page => {
        const slug = slugFromUrl(page.url)
        return {
          title: String(page.frontmatter.title ?? slug),
          description: String(page.frontmatter.description ?? ""),
          date: String(page.frontmatter.date ?? ""),
          excerpt: String(page.frontmatter.description ?? ""),
          tags: Array.isArray(page.frontmatter.tags)
            ? page.frontmatter.tags.map(String)
            : [],
          url: `/blog/${slug}`,
          slug,
          template:
            typeof page.frontmatter.template === "string"
              ? page.frontmatter.template
              : undefined,
        }
      })
      .sort(
        (left, right) =>
          +new Date(right.date ?? "") - +new Date(left.date ?? ""),
      )
  },
})
