<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from "vue"
import { useData } from "vitepress"
import DefaultTheme from "vitepress/theme"
import mermaid from "mermaid"

import PageMeta from "./components/PageMeta.vue"
import RelatedPosts from "./components/RelatedPosts.vue"

const { page, frontmatter } = useData()

const layoutClass = computed(() => {
  return frontmatter.value.unstyled === true ? "hs-layout-unstyled" : undefined
})

const showPageMeta = computed(() => {
  if (
    page.value.isNotFound ||
    frontmatter.value.layout === "home" ||
    frontmatter.value.layout === "BlogArticleLayout"
  ) {
    return false
  }

  return Boolean(frontmatter.value.type)
})

const showRelatedPosts = computed(
  () =>
    frontmatter.value.type === "blog" &&
    frontmatter.value.layout !== "BlogArticleLayout",
)

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "neutral",
})

async function renderMermaid() {
  if (typeof window === "undefined") {
    return
  }

  await nextTick()

  document
    .querySelectorAll<HTMLElement>(".mermaid[data-processed]")
    .forEach(node => {
      node.removeAttribute("data-processed")
    })

  await mermaid.run({
    querySelector: ".mermaid",
  })
}

onMounted(renderMermaid)

watch(
  () => page.value.relativePath,
  () => {
    void renderMermaid()
  },
)
</script>

<template>
  <DefaultTheme.Layout :class="layoutClass" >
    <template #doc-before>
      <PageMeta v-if="showPageMeta" />
    </template>

    <template #doc-after>
      <RelatedPosts v-if="showRelatedPosts" />
    </template>
  </DefaultTheme.Layout>
</template>
