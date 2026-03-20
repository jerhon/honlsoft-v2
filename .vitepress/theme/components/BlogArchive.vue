<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../data/posts.data"
import { formatDate, tagToSlug } from "../lib/content"

const props = withDefaults(defineProps<{ limit?: number }>(), {
  limit: undefined,
})

const visiblePosts = computed(() => {
  return typeof props.limit === "number" ? posts.slice(0, props.limit) : posts
})
</script>

<template>
  <div class="archive-grid">
    <article v-for="post in visiblePosts" :key="post.url" class="archive-card">
      <h2 class="archive-card__title">
        <a class="archive-card__link" :href="post.url">{{ post.title }}</a>
      </h2>

      <p class="archive-card__meta">{{ formatDate(post.date) }}</p>
      <p class="archive-card__excerpt">{{ post.excerpt }}</p>

      <div v-if="post.tags.length" class="archive-card__tags">
        <a
          v-for="tag in post.tags"
          :key="tag"
          class="tag-pill"
          :href="`/tag/${tagToSlug(tag)}`"
        >
          {{ tag }}
        </a>
      </div>
    </article>
  </div>
</template>
