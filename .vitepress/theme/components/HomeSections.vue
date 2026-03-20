<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../data/posts.data"
import { data as projects } from "../data/projects.data"
import { formatDate } from "../lib/content"

const recentPosts = computed(() => posts.slice(0, 4))
const featuredProjects = computed(() => projects.slice(0, 3))
</script>

<template>
  <section class="home-section">
    <h2 class="home-section__title">Recent posts</h2>

    <div class="recent-posts-list">
      <article
        v-for="post in recentPosts"
        :key="post.url"
        class="recent-posts-list__item"
      >
        <div class="recent-posts-list__meta">{{ formatDate(post.date) }}</div>
        <div class="recent-posts-list__body">
          <h3 class="recent-posts-list__title">
            <a class="archive-card__link" :href="post.url">{{ post.title }}</a>
          </h3>
          <p class="recent-posts-list__excerpt">{{ post.excerpt }}</p>
        </div>
      </article>
    </div>
  </section>

  <section class="home-section">
    <h2 class="home-section__title">Featured projects</h2>

    <div class="archive-grid">
      <article
        v-for="project in featuredProjects"
        :key="project.url"
        class="archive-card"
      >
        <h3 class="archive-card__title">
          <a class="archive-card__link" :href="project.url">{{
            project.title
          }}</a>
        </h3>
        <p class="archive-card__excerpt">{{ project.excerpt }}</p>
      </article>
    </div>
  </section>
</template>
