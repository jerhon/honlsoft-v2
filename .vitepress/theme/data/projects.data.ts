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
          date:
            typeof page.frontmatter.date === "string"
              ? page.frontmatter.date
              : undefined,
          image:
            typeof page.frontmatter.image === "string"
              ? page.frontmatter.image
              : undefined,
          excerpt: stripHtml(page.excerpt ?? ""),
          url: `/projects/${slug}`,
          slug,
          project:
            typeof page.frontmatter.project === "string"
              ? page.frontmatter.project
              : undefined,
        }
      })
      .sort((left, right) => {
        const leftDate = +new Date(left.date ?? "")
        const rightDate = +new Date(right.date ?? "")

        const leftValid = Number.isFinite(leftDate)
        const rightValid = Number.isFinite(rightDate)

        if (leftValid && rightValid && leftDate !== rightDate) {
          return rightDate - leftDate
        }

        if (leftValid && !rightValid) {
          return -1
        }

        if (!leftValid && rightValid) {
          return 1
        }

        return left.title.localeCompare(right.title)
      })
  },
})
