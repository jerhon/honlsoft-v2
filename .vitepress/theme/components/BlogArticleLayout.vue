<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useData } from "vitepress"

import RelatedPosts from "./RelatedPosts.vue"
import { formatDate, tagToSlug, titleFromSlug } from "../lib/content"

const { frontmatter, page } = useData()
const contentRef = ref<HTMLElement | null>(null)
const activeLink = ref("")
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

type HeaderItem = {
  title: string
  link: string
  level: 2 | 3
}

const headers = ref<HeaderItem[]>([])

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
      const title = node.textContent?.trim() ?? ""
      if (!title) {
        return null
      }

      if (!node.id) {
        node.id = slugifyHeading(title)
      }

      return {
        title,
        link: `#${node.id}`,
        level: node.tagName === "H3" ? 3 : 2,
      } satisfies HeaderItem
    })
    .filter((item): item is HeaderItem => item !== null)

  if (!headers.value.length) {
    activeLink.value = headers.value[0]?.link ?? ""
    return
  }

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
</script>

<template>
  <div class="blog-article-layout">
    <section class="blog-article-layout__hero hs-page-width ">
      <nav class="blog-article-layout__breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/blog/">Blog</a>
        <span>/</span>
        <span>{{ title }}</span>
      </nav>

      <p class="blog-article-layout__eyebrow hs-eyebrow">Article</p>
      <h1 class="blog-article-layout__title">{{ title }}</h1>
      <p v-if="description" class="blog-article-layout__description">
        {{ description }}
      </p>

      <div class="blog-article-layout__meta">
        <span v-if="publishedOn">Published {{ publishedOn }}</span>
        <span v-if="frontmatter.template === 'scientific'"
          >Scientific article layout</span
        >
      </div>

      <div v-if="tags.length" class="blog-article-layout__tags">
        <a
          v-for="tag in tags"
          :key="tag"
          class="tag-pill"
          :href="`/tag/${tagToSlug(tag)}`"
        >
          {{ tag }}
        </a>
      </div>
    </section>

    <div class="blog-article-layout__body hs-page-width">
      <div class="blog-article-layout__main">
        <article class="blog-article-layout__content-shell hs-content-shell">
          <div ref="contentRef">
            <Content class="vp-doc blog-article-layout__content" />
          </div>
        </article>

        <RelatedPosts />
      </div>

      <aside v-if="headers.length" class="blog-article-layout__aside">
        <div class="blog-article-layout__aside-card hs-aside-shell">
          <p class="blog-article-layout__aside-title">On this page</p>

          <ul class="blog-article-layout__outline">
            <li v-for="header in headers" :key="header.link">
              <a
                class="blog-article-layout__outline-link hs-outline-link"
                :class="{
                  'blog-article-layout__outline-link--active':
                    activeLink === header.link,
                  'blog-article-layout__outline-link--nested': header.level === 3,
                }"
                :href="header.link"
              >
                {{ header.title }}
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.blog-article-layout {
  width: 100%;
}

.blog-article-layout__hero {
  margin: 0 auto 2rem;
  padding: clamp(1.5rem, 3vw, 3rem);
}

.blog-article-layout__breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
  font-weight: 600;
}

.blog-article-layout__breadcrumbs a {
  color: #bfdbfe;
  text-decoration: none;
}

.blog-article-layout__breadcrumbs a:hover {
  color: #fff;
  text-decoration: underline;
}

.blog-article-layout__eyebrow {
  margin: 0 0 0.75rem;
}

.blog-article-layout__title {
  margin: 0;
  color: #fff;
  font-family: "Lato", sans-serif;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.blog-article-layout__description {
  margin: 1rem 0 0;
  max-width: 900px;
  color: var(--vp-c-text-2);
  font-size: clamp(1.08rem, 1.5vw, 1.3rem);
  line-height: 1.8;
}

.blog-article-layout__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem 1.25rem;
  margin-top: 1.25rem;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
  font-weight: 600;
}

.blog-article-layout__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1.25rem;
}

.blog-article-layout__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 2rem;
  align-items: start;
  width: 100%;
  margin: 0 auto;
}

.blog-article-layout__main {
  min-width: 0;
}

.blog-article-layout__content {
  padding: 2rem clamp(1.25rem, 2.2vw, 2.75rem) 3rem;
}

.blog-article-layout__content :deep(h1:first-child) {
  display: none;
}

.blog-article-layout__aside {
  position: sticky;
  top: calc(var(--vp-nav-height) + 2rem);
}

.blog-article-layout__aside-card {
  padding: 1.2rem 1.15rem;
}

.blog-article-layout__aside-title {
  margin: 0 0 0.9rem;
  color: #fff;
  font-family: "Lato", sans-serif;
  font-size: 1rem;
  font-weight: 700;
}

.blog-article-layout__outline,
.blog-article-layout__outline--nested {
  list-style: none;
  margin: 0;
  padding: 0;
}

.blog-article-layout__outline li + li {
  margin-top: 0.55rem;
}

.blog-article-layout__outline-link {
  display: block;
  border-left: 2px solid transparent;
  padding-left: 0.8rem;
  line-height: 1.55;
  transition:
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.blog-article-layout__outline-link--active {
  border-left-color: rgba(96, 165, 250, 0.92);
  color: #fff;
  font-weight: 700;
  transform: translateX(2px);
}

.blog-article-layout__outline-link--nested {
  margin-left: 0.95rem;
  font-size: 0.95rem;
}

@media (max-width: 1279px) {
  .blog-article-layout__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .blog-article-layout__aside {
    position: static;
  }
}
</style>
