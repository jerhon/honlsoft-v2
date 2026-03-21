<script setup lang="ts">
import { onMounted, ref } from "vue"

import { formatDate, type ContentCard } from "../lib/content"
import styles from "./PostList.module.css"

const props = defineProps<{
  posts: ContentCard[]
}>()

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
  <div :class="styles.postList">
    <article v-for="post in props.posts" :key="post.url" :class="styles.postItem">
      <a :class="styles.postLink" :href="post.url" @click="markVisited(post.url)">
        <div :class="styles.postMeta">{{ formatDate(post.date) }}</div>
        <div :class="styles.postBody">
          <h3 :class="styles.postTitle">
            <span>{{ post.title }}</span>
            <span
              v-if="isVisited(post.url)"
              :class="styles.postVisited"
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
          <p :class="styles.postExcerpt">{{ post.excerpt }}</p>
        </div>
        <span :class="styles.postArrow" aria-hidden="true">
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
</template>