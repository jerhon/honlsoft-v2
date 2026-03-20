<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../data/posts.data"
import { formatDate } from "../lib/content"

const recentPosts = computed(() => posts.slice(0, 4))
</script>

<template>
  <section class="home-section home-section--recent-posts">
    <div class="recent-posts-list">
      <article
        v-for="post in recentPosts"
        :key="post.url"
        class="recent-posts-list__item"
      >
        <a class="recent-posts-list__link" :href="post.url">
          <div class="recent-posts-list__meta">{{ formatDate(post.date) }}</div>
          <div class="recent-posts-list__body">
            <h3 class="recent-posts-list__title">{{ post.title }}</h3>
            <p class="recent-posts-list__excerpt">{{ post.excerpt }}</p>
          </div>
          <span class="recent-posts-list__arrow" aria-hidden="true">
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
