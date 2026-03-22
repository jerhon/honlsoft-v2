<script setup lang="ts">
import { computed } from "vue"

import { data as projects } from "../../data/projects.data"
import type { ContentCard } from "../../lib/content"
import PostList from "../PostList.vue"

const projectPosts = computed<ContentCard[]>(() => {
  return projects.map(project => ({
    title: project.title,
    description: project.description,
    excerpt: project.description,
    tags: [],
    url: project.url,
    slug: project.slug,
    date: project.date,
    image: project.image,
  }))
})
</script>

<template>
  <PostList :posts="projectPosts" />
</template>
