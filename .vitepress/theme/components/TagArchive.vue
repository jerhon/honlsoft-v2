<script setup lang="ts">
import { computed } from "vue"
import { useData } from "vitepress"

import { data as posts } from "../data/posts.data"
import { formatDate, tagToSlug } from "../lib/content"
import styles from "./TagArchive.module.css"

const props = defineProps<{ tag?: string }>()
const { params } = useData()

const tagName = computed(
  () =>
    props.tag ?? (typeof params.value.tag === "string" ? params.value.tag : ""),
)

const filteredPosts = computed(() => {
  return posts.filter(post => post.tags.includes(tagName.value))
})
</script>

<template>
  <div v-if="tagName">
    <p :class="styles.lead">
      {{ filteredPosts.length }} post<span v-if="filteredPosts.length !== 1"
        >s</span
      >
      tagged with <strong>{{ tagName }}</strong
      >.
    </p>

    <div class="archive-grid">
      <article
        v-for="post in filteredPosts"
        :key="post.url"
        class="archive-card"
      >
        <h2 class="archive-card__title">
          <a class="archive-card__link" :href="post.url">{{ post.title }}</a>
        </h2>
        <p class="archive-card__meta">{{ formatDate(post.date) }}</p>
        <p class="archive-card__excerpt">{{ post.excerpt }}</p>
        <div class="archive-card__tags">
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
  </div>
</template>
