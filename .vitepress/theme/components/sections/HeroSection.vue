<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../../data/posts.data"
import { formatDate } from "../../lib/content"
import styles from "./HeroSection.module.css"

const latestPost = computed(() => posts[0] ?? null)
</script>

<template>
  <section :class="styles.hero" aria-label="Honlsoft introduction">
    <div :class="[styles.inner, 'hs-page-width px-4 sm:px-6 lg:px-8']">
      <div :class="styles.intro">
        <p :class="styles.eyebrow">Notes from the workbench</p>
        <h1 :class="styles.title">Building software, <em>thinking out loud.</em></h1>
        <p :class="styles.description">
          I'm Jeremy Honl. I write about software architecture, .NET, containers,
          AI-assisted development, and the projects I learn from along the way.
        </p>
        <a href="/blog/" :class="styles.browse">Explore the writing <span aria-hidden="true">&rarr;</span></a>
      </div>

      <a v-if="latestPost" :href="latestPost.url" :class="styles.featured">
        <span :class="styles.featuredLabel">Latest story <span>{{ formatDate(latestPost.date) }}</span></span>
        <strong :class="styles.featuredTitle">{{ latestPost.title }}</strong>
        <span v-if="latestPost.description" :class="styles.featuredDescription">{{ latestPost.description }}</span>
        <span :class="styles.featuredAction">Read article <span aria-hidden="true">&nearr;</span></span>
      </a>
    </div>
  </section>
</template>
