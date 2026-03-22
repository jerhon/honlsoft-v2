<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../../data/posts.data"
import PostList from "../PostList.vue"

const props = withDefaults(defineProps<{ limit?: number }>(), {
  limit: undefined,
})

const visiblePosts = computed(() => {
  return typeof props.limit === "number" ? posts.slice(0, props.limit) : posts
})
</script>

<template>
  <PostList :posts="visiblePosts" />
</template>
