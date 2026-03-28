<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../data/posts.data"
import { tagToSlug } from "../lib/content"
import styles from "./TagDirectory.module.css"

const tags = computed(() => {
  const counts = new Map<string, number>()

  posts.forEach(post => {
    post.tags.forEach(tag => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    })
  })

  return [...counts.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([tag, count]) => ({
      tag,
      count,
      url: `/tag/${tagToSlug(tag)}`,
    }))
})
</script>

<template>
  <div :class="styles.grid">
    <a
      v-for="tag in tags"
      :key="tag.tag"
      :class="styles.item"
      :href="tag.url"
    >
      <span>{{ tag.tag }}</span>
      <span :class="styles.count">{{ tag.count }}</span>
    </a>
  </div>
</template>
