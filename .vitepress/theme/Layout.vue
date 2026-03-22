<script setup lang="ts">
import { computed, nextTick, onMounted, type Component, watch } from "vue"
import { useData } from "vitepress"
import mermaid from "mermaid"

import BlogArticleLayout from "./components/layouts/BlogArticleLayout.vue"
import PageLayout from "./components/layouts/PageLayout.vue"
import ScientificArticleLayout from "./components/layouts/ScientificArticleLayout.vue"
import SiteNavbar from "./components/SiteNavbar.vue"

const { page, frontmatter } = useData()

function getLayoutComponent(): Component {
  const template =
    typeof frontmatter.value.template === "string"
      ? frontmatter.value.template.toLowerCase()
      : ""

  if (template === "scientific") {
    return ScientificArticleLayout
  }

  const pageType =
    typeof frontmatter.value.type === "string"
      ? frontmatter.value.type.toLowerCase()
      : ""

  if (pageType === "page") {
    return PageLayout
  }

  if (pageType === "blog") {
    return BlogArticleLayout
  }

  if (page.value.relativePath.startsWith("blog/")) {
    return BlogArticleLayout
  }

  return PageLayout
}

const currentLayout = computed(() => getLayoutComponent())

const layoutClass = computed(() => {
  return frontmatter.value.unstyled === true ? "hs-layout-unstyled" : undefined
})

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

onMounted(() => {
  void renderMermaid()
})

watch(
  () => page.value.relativePath,
  () => {
    void renderMermaid()
  },
)
</script>

<template>
  <div :class="['hs-layout', layoutClass]">
    <SiteNavbar v-if="frontmatter.unstyled !== true" />

    <main class="hs-layout__content">
      <component :is="currentLayout" />
    </main>
  </div>
</template>
