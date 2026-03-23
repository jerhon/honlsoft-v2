<script setup lang="ts">
import { computed } from "vue"
import { useData } from "vitepress"

import { data as posts } from "../../data/posts.data"
import PostList from "../PostList.vue"
import styles from "./RelatedPosts.module.css"

const { frontmatter, page } = useData()

const currentSlug = computed(
  () => page.value.relativePath.replace(/\.md$/, "").split("/").pop() ?? "",
)

const related = computed(() => {

  
  if (frontmatter.value.project) {
    return posts
      .filter(post => post.tags.includes(frontmatter.value.project) && post.slug !== currentSlug.value)
      .map(post => ({
        post,
        sharedTags: []
      }));
  }

  const tags = new Set(
    Array.isArray(frontmatter.value.tags)
      ? frontmatter.value.tags.map(String)
      : [],
  )

  const ranked = posts
    .filter(post => post.slug !== currentSlug.value)
    .map(post => ({
      post,
      sharedTags: post.tags.filter(tag => tags.has(tag)),
    }))
    .filter(entry => entry.sharedTags.length > 0)
    .sort((left, right) => right.sharedTags.length - left.sharedTags.length)
    .slice(0, 3)

  return ranked
})
</script>

<template>
  <section v-if="related.length" :class="styles.relatedPosts">
    <h2 :class="styles.title">Related posts</h2>

    <PostList :posts="related.map(entry => entry.post)" />
  </section>
</template>
