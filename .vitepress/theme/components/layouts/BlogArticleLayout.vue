<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { useData } from "vitepress"

import RelatedPosts from "../sections/RelatedPosts.vue"
import { formatDate, tagToSlug, titleFromSlug } from "../../lib/content"
import styles from "./BlogArticleLayout.module.css"

const { frontmatter, page } = useData()
const contentRef = ref<HTMLElement | null>(null)
const overviewLink = "#article-overview"

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

const showDescription = computed(() => frontmatter.value.showDescription !== false)

const description = computed(() => {
  if (!showDescription.value) {
    return ""
  }

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
  level: 1 | 2 | 3
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
    contentRoot.querySelectorAll<HTMLHeadingElement>("h1, h2, h3"),
  )

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
        level: node.tagName === "H1" ? 1 : node.tagName === "H2" ? 2 : 3,
      } satisfies HeaderItem
    })
    .filter((item): item is HeaderItem => item !== null)

}

onMounted(() => {
  void syncOutline()
})

watch(
  () => page.value.relativePath,
  () => {
    void syncOutline()
  },
)
</script>

<template>
  <div :class="styles.root">
    <section
      id="article-overview"
      :class="[styles.hero, 'hs-page-width px-6 sm:px-8 lg:px-12']"
    >
      <h1 :class="styles.title">{{ title }}</h1>
      <p v-if="description" :class="styles.description">
        {{ description }}
      </p>

      <div :class="styles.meta">
        <span v-if="publishedOn">Published {{ publishedOn }}</span>
        <span v-if="frontmatter.template === 'scientific'"
          >Scientific article layout</span
        >
      </div>

      <div v-if="tags.length" :class="styles.tags">
        <a
          v-for="tag in tags"
          :key="tag"
          :class="styles.tag"
          :href="`/tag/${tagToSlug(tag)}`"
        >
          {{ tag }}
        </a>
      </div>
    </section>

    <div
      :class="[
        styles.body,
        !headers.length && styles.bodyNoAside,
        'hs-page-width px-4',
      ]"
    >
      <div :class="styles.main">
        <article :class="styles.articleCard">
          <div ref="contentRef" :class="[styles.content]">
            <Content />
          </div>
        </article>

        <RelatedPosts />
      </div>

      <aside v-if="headers.length" :class="styles.aside">
        <div :class="styles.asideCard">
          <p :class="styles.asideTitle">On this page</p>

          <ul :class="styles.outline">
            <li>
              <a
                :class="styles.outlineLink"
                :href="overviewLink"
              >
                Overview
              </a>
            </li>
            <li v-for="header in headers" :key="header.link">
              <a
                :class="[
                  styles.outlineLink,
                  header.level === 3 && styles.outlineLinkNested,
                ]"
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