<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../../data/posts.data"
import PostList from "../PostList.vue"
import styles from "./RecentPosts.module.css"

const recentPosts = computed(() => posts.slice(0, 10))
</script>

<template>
  <section
    id="recent-posts"
    :class="[
      styles.homeSection,
      styles.recentPostsSection,
      'hs-page-width scroll-mt-30 px-6 sm:px-8 lg:px-12',
    ]"
  >
    <PostList :posts="recentPosts" />
  </section>
</template>
