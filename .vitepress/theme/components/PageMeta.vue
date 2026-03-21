<script setup lang="ts">
import { computed } from "vue"
import { useData } from "vitepress"

import { formatDate, titleFromSlug, tagToSlug } from "../lib/content"
import styles from "./PageMeta.module.css"

const { frontmatter, page } = useData()

const title = computed(() => {
  if (
    typeof frontmatter.value.title === "string" &&
    frontmatter.value.title.length > 0
  ) {
    return frontmatter.value.title
  }

  const relativePath = page.value.relativePath.replace(/\.md$/, "")
  return titleFromSlug(relativePath.split("/").pop() ?? "page")
})

const breadcrumbs = computed(() => {
  const items: Array<{ text: string; url?: string }> = [
    { text: "Home", url: "/" },
  ]
  const type = frontmatter.value.type

  if (frontmatter.value.page) {
    items.push({ text: title.value })
    return items
  }

  if (type === "blog") {
    items.push({ text: "Blog", url: "/blog/" }, { text: title.value })
    return items
  }

  if (type === "projects") {
    items.push({ text: "Projects", url: "/projects/" }, { text: title.value })
    return items
  }

  items.push({ text: title.value })
  return items
})

const tags = computed(() => {
  return Array.isArray(frontmatter.value.tags)
    ? frontmatter.value.tags.map(String)
    : []
})

const publishedOn = computed(() =>
  formatDate(
    typeof frontmatter.value.date === "string"
      ? frontmatter.value.date
      : undefined,
  ),
)
</script>

<template>
  <div :class="styles.pageMeta">
    <nav :class="styles.pageMetaBreadcrumbs" aria-label="Breadcrumb">
      <template v-for="(item, idx) in breadcrumbs" :key="`${item.text}-${idx}`">
        <a v-if="item.url" :href="item.url">{{ item.text }}</a>
        <span v-else>{{ item.text }}</span>
        <span v-if="idx < breadcrumbs.length - 1">/</span>
      </template>
    </nav>

    <div :class="styles.pageMetaDetails">
      <span v-if="publishedOn">Published {{ publishedOn }}</span>
      <span v-if="frontmatter.template === 'scientific'"
        >Scientific article layout</span
      >

      <div v-if="tags.length" :class="styles.pageMetaTags">
        <a
          v-for="tag in tags"
          :key="tag"
          class="tag-pill"
          :href="`/tag/${tagToSlug(tag)}`"
        >
          {{ tag }}
        </a>
      </div>
    </div>
  </div>
</template>
