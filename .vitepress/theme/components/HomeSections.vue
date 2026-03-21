<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../data/posts.data"
import { formatDate } from "../lib/content"
import styles from "./HomeSections.module.css"

const recentPosts = computed(() => posts.slice(0, 10))
</script>

<template>
  <section
    id="recent-posts"
    :class="[styles.homeSection, styles.recentPostsSection, 'scroll-mt-30']"
  >
    <div :class="styles.recentPostsList">
      <article
        v-for="post in recentPosts"
        :key="post.url"
        :class="styles.recentPostsItem"
      >
        <a :class="styles.recentPostsLink" :href="post.url">
          <div :class="styles.recentPostsMeta">{{ formatDate(post.date) }}</div>
          <div :class="styles.recentPostsBody">
            <h3 :class="styles.recentPostsTitle">{{ post.title }}</h3>
            <p :class="styles.recentPostsExcerpt">{{ post.excerpt }}</p>
          </div>
          <span :class="styles.recentPostsArrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M8 12h8m0 0-3.5-3.5M16 12l-3.5 3.5"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
              />
            </svg>
          </span>
        </a>
      </article>
    </div>
  </section>
</template>
