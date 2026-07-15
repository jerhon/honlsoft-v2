<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../../data/posts.data"
import { formatDate } from "../../lib/content"
import styles from "./HeroSection.module.css"

const latestPost = computed(() => posts[0] ?? null)
</script>

<template>
  <section
    :class="[styles.heroShell, 'relative isolate overflow-hidden text-white']"
    aria-label="Honlsoft introduction"
  >
    <div class="absolute inset-0 bg-linear-to-br from-slate-950 via-blue-950 to-blue-900"></div>
    <div :class="[styles.heroAurora, styles.heroAuroraLeft]"></div>
    <div :class="[styles.heroAurora, styles.heroAuroraRight]"></div>
    <div :class="[styles.heroGrid, 'absolute inset-0 opacity-30']"></div>

    <div
      :class="[
        styles.heroShellContent,
        'hs-page-width relative z-10 flex flex-col items-center px-6 py-16 sm:px-8 lg:px-12 lg:py-24',
      ]"
    >
      <!-- Main headline section -->
      <div :class="[styles.fadeUp, 'max-w-4xl text-center']">
        <h1 class="font-title text-4xl font-bold sm:text-5xl lg:text-6xl leading-tight">
          Let's build software
          <br />
          people <span :class="styles.heroHighlight">dream</span> of using.
        </h1>
        <p
          :class="[
            styles.fadeUp,
            styles.delay1,
            'mt-6 text-lg text-blue-50/85 sm:text-xl max-w-2xl mx-auto leading-relaxed',
          ]"
        >
          Practical notes on software architecture, .NET, containers, AI-assisted development, and the side projects that keep engineering fun.
        </p>
      </div>

      <!-- Feature cards -->
      <div
        :class="[
          styles.fadeUp,
          styles.delay2,
          'mt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl',
        ]"
      >
        <div class="hs-card p-5 sm:p-6 text-center">
          <p class="hs-meta-label text-blue-200/70">Focus</p>
          <p class="mt-3 font-title text-2xl font-bold text-white">Practical DX</p>
          <p class="mt-2 text-sm text-blue-50/75">
            Developer experience first, always
          </p>
        </div>

        <div class="hs-card p-5 sm:p-6 text-center">
          <p class="hs-meta-label text-blue-200/70">Coverage</p>
          <p class="mt-3 font-title text-2xl font-bold text-white">4+ Topics</p>
          <p class="mt-2 text-sm text-blue-50/75">
            architecture, containers, AI, projects
          </p>
        </div>

        <div class="hs-card p-5 sm:p-6 text-center">
          <p class="hs-meta-label text-blue-200/70">Approach</p>
          <p class="mt-3 font-title text-2xl font-bold text-white">Hands-on</p>
          <p class="mt-2 text-sm text-blue-50/75">
            implementation-first, concrete examples
          </p>
        </div>
      </div>

      <!-- Latest post card -->
      <section
        v-if="latestPost"
        :class="[
          styles.fadeUp,
          styles.delay3,
          'mt-12 w-full max-w-4xl hs-card p-6 sm:p-8',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <p class="hs-meta-label text-blue-200/70">Latest post</p>
          <p class="text-sm font-semibold text-blue-100/75">
            {{ formatDate(latestPost.date) }}
          </p>
        </div>
        <h2 class="font-title text-2xl font-bold text-white sm:text-3xl">
          {{ latestPost.title }}
        </h2>
        <p v-if="latestPost.description" class="mt-4 text-base text-blue-50/85 leading-relaxed">
          {{ latestPost.description }}
        </p>
        <div class="mt-6">
          <a :href="latestPost.url" class="hs-btn hs-btn-primary">
            Read this post
          </a>
        </div>
      </section>
    </div>
  </section>
</template>
