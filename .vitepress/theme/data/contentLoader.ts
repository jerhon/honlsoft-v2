import { createContentLoader } from "vitepress"
import { Content, slugFromUrl } from "../lib/content"

export function createBlogData(importPath: string, type: string, baseUrl?: string) {
    
    baseUrl = baseUrl ?? type;

    return createContentLoader<Content[]>(importPath, {
        excerpt: false,
        transform(rawData): Content[] {
            return rawData
                .filter(page => page.frontmatter.type === type)
                .map(page => {
                    const slug = slugFromUrl(page.url)
                    return {
                        title: String(page.frontmatter.title ?? slug),
                        description: String(page.frontmatter.description ?? ""),
                        date: String(page.frontmatter.date ?? ""),
                        tags: Array.isArray(page.frontmatter.tags)
                            ? page.frontmatter.tags.map(String)
                            : [],
                        url: `/${baseUrl}/${slug}`,
                        slug,
                        type: page.frontmatter.type === type ? type : "blog",
                        project: typeof page.frontmatter.project === "string" ? page.frontmatter.project : undefined,
                        image: typeof page.frontmatter.image === "string" ? page.frontmatter.image : undefined,
                    }
                })
                .sort(
                    (left, right) =>
                        +new Date(right.date ?? "") - +new Date(left.date ?? ""),
                )
        },
    })
}
