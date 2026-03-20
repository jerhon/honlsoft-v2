import fs from "node:fs"
import path from "node:path"

import { tagToSlug } from "../../.vitepress/theme/lib/content"

export default {
  watch: ["../blog/**/*.md"],
  async paths() {
    const tags = new Map<string, string>()

    const blogRoot = path.resolve("content/blog")
    const markdownFiles = fs
      .readdirSync(blogRoot, { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith(".md"))
      .map(entry => path.join(entry.parentPath, entry.name))

    markdownFiles.forEach(filePath => {
      const contents = fs.readFileSync(filePath, "utf8")
      const frontmatterMatch = contents.match(/^---\s*([\s\S]*?)\s*---/)
      const frontmatter = frontmatterMatch?.[1] ?? ""
      const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/)

      if (!tagsMatch) {
        return
      }

      tagsMatch[1]
        .split(",")
        .map(value => value.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
        .forEach(tag => {
          tags.set(tagToSlug(tag), tag)
        })
    })

    return [...tags.entries()]
      .sort((left, right) => left[1].localeCompare(right[1]))
      .map(([slug, tag]) => ({
        params: {
          slug,
          tag,
        },
      }))
  },
}
