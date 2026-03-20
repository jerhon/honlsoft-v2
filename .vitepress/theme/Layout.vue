<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from "vue"
import { useData } from "vitepress"
import DefaultTheme from "vitepress/theme"
import mermaid from "mermaid"

import PageMeta from "./components/PageMeta.vue"
import RelatedPosts from "./components/RelatedPosts.vue"

const { page, frontmatter } = useData()

const showPageMeta = computed(() => {
  if (page.value.isNotFound || frontmatter.value.layout === "home") {
    return false
  }

  return Boolean(frontmatter.value.type)
})

const showRelatedPosts = computed(() => frontmatter.value.type === "blog")

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
  <DefaultTheme.Layout>
    <template #doc-before>
      <PageMeta v-if="showPageMeta" />
    </template>

    <template #doc-after>
      <RelatedPosts v-if="showRelatedPosts" />
    </template>
  </DefaultTheme.Layout>
</template>
