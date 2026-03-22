<script setup lang="ts">
import { computed } from "vue"
import { useData } from "vitepress"

import { data as posts } from "../data/posts.data"
import PostList from "./PostList.vue"
import styles from "./TagArchive.module.css"

const props = defineProps<{ tag?: string }>()
const { params } = useData()

const tagName = computed(() => {
  if (props.tag) {
    return props.tag
  }

  const routeTag = params.value?.tag
  return typeof routeTag === "string" ? routeTag : ""
})

const filteredPosts = computed(() => {
  return posts.filter(post => post.tags.includes(tagName.value))
})
</script>

<template>
  <div v-if="tagName">
    <header :class="styles.header">
      <p :class="styles.eyebrow">Tag archive</p>
      <h1 :class="styles.title">Posts tagged {{ tagName }}</h1>
      <p :class="styles.lead">
        {{ filteredPosts.length }} post<span v-if="filteredPosts.length !== 1"
          >s</span
        >
        tagged with <strong>{{ tagName }}</strong
        >.
      </p>
    </header>

    <PostList :posts="filteredPosts" />
  </div>
</template>
