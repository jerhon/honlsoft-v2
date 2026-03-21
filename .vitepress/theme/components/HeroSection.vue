<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../data/posts.data"
import { formatDate } from "../lib/content"
import styles from "./HeroSection.module.css"

const latestPost = computed(() => posts[0] ?? null)

function scrollToPosts() {
  if (typeof document === "undefined") {
    return
  }

  document.getElementById("recent-posts")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}
</script>

<template>
  <section
    :class="[styles.heroShell, 'relative isolate overflow-hidden text-white']"
    aria-label="Honlsoft introduction"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900"></div>
    <div :class="[styles.heroAurora, styles.heroAuroraLeft]"></div>
    <div :class="[styles.heroAurora, styles.heroAuroraRight]"></div>
    <div :class="[styles.heroGrid, 'absolute inset-0 opacity-30']"></div>

    <div
      :class="[
        styles.heroShellContent,
        'hs-page-width relative z-10 flex items-center px-6 py-24 sm:px-8 lg:px-12',
      ]"
    >
      <div class="grid w-full gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div class="space-y-8">
          <div class="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
            <div
              :class="[
                styles.heroKicker,
                styles.fadeUp,
                'border-white/20 text-center lg:border-r lg:pr-8 lg:text-right',
              ]"
            >
              <div class="font-title text-3xl font-bold sm:text-4xl lg:text-5xl">
                Jeremy's
              </div>
              <div
                :class="[
                  styles.fadeUp,
                  styles.delay1,
                  'font-title text-3xl font-bold sm:text-4xl lg:text-5xl',
                ]"
              >
                Technology Blog
              </div>
            </div>

            <div class="space-y-4 text-center lg:text-left">
              <p
                :class="[
                  styles.fadeUp,
                  styles.delay3,
                  'font-title text-4xl font-bold leading-none text-blue-50 sm:text-4xl lg:text-4xl',

                ]"
              >

                Let's build software
                people <span :class="styles.heroHighlight">dream</span> of using.
              </p>
            </div>
          </div>

          <p
            :class="[
              styles.fadeUp,
              styles.delay4,
              'max-w-3xl py-8 text-lg leading-8 text-blue-50/85 sm:text-xl',
            ]"
          >
            Practical notes on software architecture, .NET, containers, AI-assisted
            development, and the side projects that keep engineering fun.
          </p>

          <section
            v-if="latestPost"
            :class="[styles.fadeUp, styles.delay5, 'hs-card max-w-3xl p-5 sm:p-6']"
          >
            <p class="hs-meta-label pb-4 text-blue-200/70">Latest post</p>
            <h2 class="mt-3 font-title text-2xl font-bold text-white sm:text-3xl">
              {{ latestPost.title }}
            </h2>
            <p v-if="latestPost.date" class="mt-2 text-sm font-semibold text-blue-100/75">
              {{ formatDate(latestPost.date) }}
            </p>
            <p v-if="latestPost.description" class="mt-4 pt-4 text-base text-blue-50/85">
              {{ latestPost.description }}
            </p>
            <div class="mt-5">
              <a :href="latestPost.url" class="hs-btn hs-btn-primary">
                Read this post
              </a>
            </div>
          </section>

          <div
            :class="[
              styles.fadeUp,
              styles.delay6,
              'flex flex-wrap gap-3 pt-2 text-sm text-blue-100/80',
            ]"
          >
            <span class="hs-chip">Software Architecture</span>
            <span class="hs-chip">.NET &amp; APIs</span>
            <span class="hs-chip">AI Tooling</span>
            <span class="hs-chip">Side Projects</span>
          </div>
        </div>

        <div :class="[styles.fadeUp, styles.delay4, 'relative']">
          <div :class="[styles.heroPanel, 'hs-panel p-6']">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-300/10"></div>

            <div class="relative space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="mt-2 font-title text-2xl font-bold text-white">
                    What you'll find here
                  </p>
                </div>

                <div class="hs-card bg-white/10 px-4 py-3 text-center">
                  <p class="hs-meta-label text-blue-100/70">Focus</p>
                  <p class="mt-1 font-title text-xl font-bold text-white">Practical DX</p>
                </div>
              </div>

              <div class="space-y-4">
                <div class="hs-card p-4">
                  <p class="hs-meta-label text-blue-200/70">Recently</p>
                  <p class="mt-2 font-title text-xl font-bold text-white">
                    AI workflows and developer productivity
                  </p>
                  <p class="mt-2 text-sm leading-6 text-blue-50/75">
                    Notes on using Copilot agents, CLI workflows, and implementation
                    experiments that save real engineering time.
                  </p>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="hs-card-blue p-4">
                    <p class="hs-meta-label text-blue-200/70">Topics</p>
                    <p class="mt-2 text-3xl font-bold text-white">4+</p>
                    <p class="mt-1 text-sm text-blue-50/75">
                      architecture, containers, AI, and projects
                    </p>
                  </div>
                  <div class="hs-card-red p-4">
                    <p class="hs-meta-label text-red-200/70">Style</p>
                    <p class="mt-2 text-3xl font-bold text-white">Hands-on</p>
                    <p class="mt-1 text-sm text-blue-50/75">
                      implementation-first writeups with concrete examples
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      :class="styles.scrollLink"
      aria-label="Scroll to recent posts"
      @click="scrollToPosts"
    >
      <span :class="styles.scrollLabel">Recent posts</span>
      <span :class="styles.scrollIcon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 6v12m0 0 4-4m-4 4-4-4"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
          />
        </svg>
      </span>
    </button>
  </section>
</template>
