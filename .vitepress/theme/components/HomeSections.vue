<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

import { data as posts } from "../data/posts.data"
import { formatDate } from "../lib/content"
import styles from "./HomeSections.module.css"

const recentPosts = computed(() => posts.slice(0, 10))
const visitedPostUrls = ref<Set<string>>(new Set())
const visitedStorageKey = "hs-visited-posts"

function isVisited(url: string) {
  return visitedPostUrls.value.has(url)
}

function persistVisitedPosts() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    visitedStorageKey,
    JSON.stringify([...visitedPostUrls.value]),
  )
}

function markVisited(url: string) {
  if (visitedPostUrls.value.has(url)) {
    return
  }

  visitedPostUrls.value.add(url)
  persistVisitedPosts()
}

onMounted(() => {
  if (typeof window === "undefined") {
    return
  }

  const saved = window.localStorage.getItem(visitedStorageKey)
  if (!saved) {
    return
  }

  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) {
      visitedPostUrls.value = new Set(parsed.map(String))
    }
  } catch {
    window.localStorage.removeItem(visitedStorageKey)
  }
})
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
    <div :class="styles.recentPostsList">
      <article
        v-for="post in recentPosts"
        :key="post.url"
        :class="styles.recentPostsItem"
      >
        <a
          :class="styles.recentPostsLink"
          :href="post.url"
          @click="markVisited(post.url)"
        >
          <div :class="styles.recentPostsMeta">{{ formatDate(post.date) }}</div>
          <div :class="styles.recentPostsBody">
            <h3 :class="styles.recentPostsTitle">
              <span>{{ post.title }}</span>
              <span
                v-if="isVisited(post.url)"
                :class="styles.recentPostsVisited"
                aria-label="Visited"
                title="Visited"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="m5 13 4 4L19 7"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.3"
                  />
                </svg>
              </span>
            </h3>
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
