import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useData } from "vitepress"

import { formatDate, titleFromSlug } from "./content"

export type ArticleHeaderItem = {
  title: string
  link: string
  level: 2 | 3
}

export function useArticleLayout() {
  const { frontmatter, page } = useData()
  const contentRef = ref<HTMLElement | null>(null)
  const activeLink = ref("")
  const headers = ref<ArticleHeaderItem[]>([])
  let outlineHeadingNodes: HTMLHeadingElement[] = []
  let scrollFrame = 0

  const title = computed(() => {
    if (
      typeof frontmatter.value.title === "string" &&
      frontmatter.value.title.length > 0
    ) {
      return frontmatter.value.title
    }

    const relativePath = page.value.relativePath.replace(/\.md$/, "")
    return titleFromSlug(relativePath.split("/").pop() ?? "article")
  })

  const description = computed(() => {
    if (
      typeof frontmatter.value.description === "string" &&
      frontmatter.value.description.length > 0
    ) {
      return frontmatter.value.description
    }

    return ""
  })

  const publishedOn = computed(() =>
    formatDate(
      typeof frontmatter.value.date === "string"
        ? frontmatter.value.date
        : undefined,
    ),
  )

  const tags = computed(() => {
    return Array.isArray(frontmatter.value.tags)
      ? frontmatter.value.tags.map(String)
      : []
  })

  function slugifyHeading(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  }

  async function syncOutline() {
    if (typeof window === "undefined") {
      return
    }

    await nextTick()

    const contentRoot = contentRef.value
    if (!contentRoot) {
      headers.value = []
      return
    }

    const headingNodes = Array.from(
      contentRoot.querySelectorAll<HTMLHeadingElement>("h2, h3"),
    )

    outlineHeadingNodes = headingNodes

    headers.value = headingNodes
      .map(node => {
        const headingTitle = node.textContent?.trim() ?? ""
        if (!headingTitle) {
          return null
        }

        if (!node.id) {
          node.id = slugifyHeading(headingTitle)
        }

        return {
          title: headingTitle,
          link: `#${node.id}`,
          level: node.tagName === "H3" ? 3 : 2,
        } satisfies ArticleHeaderItem
      })
      .filter((item): item is ArticleHeaderItem => item !== null)

    activeLink.value = headers.value[0]?.link ?? ""
    updateActiveHeading()
  }

  function updateActiveHeading() {
    if (typeof window === "undefined" || !outlineHeadingNodes.length) {
      return
    }

    const offset = window.innerHeight * 0.22
    let currentLink = headers.value[0]?.link ?? ""

    for (const node of outlineHeadingNodes) {
      const top = node.getBoundingClientRect().top
      if (top - offset <= 0) {
        currentLink = `#${node.id}`
        continue
      }

      break
    }

    activeLink.value = currentLink
  }

  function handleScroll() {
    if (typeof window === "undefined") {
      return
    }

    if (scrollFrame) {
      window.cancelAnimationFrame(scrollFrame)
    }

    scrollFrame = window.requestAnimationFrame(() => {
      updateActiveHeading()
      scrollFrame = 0
    })
  }

  onMounted(() => {
    void syncOutline()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
  })

  onBeforeUnmount(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (scrollFrame) {
        window.cancelAnimationFrame(scrollFrame)
      }
    }
  })

  watch(
    () => page.value.relativePath,
    () => {
      void syncOutline()
    },
  )

  return {
    activeLink,
    contentRef,
    description,
    frontmatter,
    headers,
    page,
    publishedOn,
    tags,
    title,
  }
}
