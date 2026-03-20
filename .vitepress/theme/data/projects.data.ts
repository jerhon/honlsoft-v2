import { createContentLoader } from "vitepress"

import { slugFromUrl, stripHtml, type ProjectCard } from "../lib/content"

declare const data: ProjectCard[]
export { data }

export default createContentLoader("projects/*.md", {
  excerpt: true,
  transform(rawData): ProjectCard[] {
    return rawData
      .filter(page => page.frontmatter.type === "projects")
      .map(page => {
        const slug = slugFromUrl(page.url)
        return {
          title: String(
            page.frontmatter.title ?? page.frontmatter.project ?? slug,
          ),
          description: String(page.frontmatter.description ?? ""),
          excerpt: stripHtml(page.excerpt ?? ""),
          url: `/projects/${slug}`,
          slug,
          project:
            typeof page.frontmatter.project === "string"
              ? page.frontmatter.project
              : undefined,
        }
      })
      .sort((left, right) => left.title.localeCompare(right.title))
  },
})
