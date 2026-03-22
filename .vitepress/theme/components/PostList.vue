<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"

import { formatDate, type Content } from "../lib/content"
import styles from "./PostList.module.css"

const props = defineProps<{
  posts: Content[]
}>()

const pageSize = 20
const currentPage = ref(1)
const pageQueryParam = "page"

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.posts.length / pageSize))
})

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return props.posts.slice(start, start + pageSize)
})

watch(
  () => props.posts,
  () => {
    const pageFromUrl = getPageFromUrl()
    currentPage.value = pageFromUrl ?? 1
  },
)

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value)
}

function getPageFromUrl() {
  if (typeof window === "undefined") {
    return null
  }

  const rawValue = new URLSearchParams(window.location.search).get(pageQueryParam)
  if (!rawValue) {
    return null
  }

  const parsed = Number(rawValue)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

function syncPageToUrl(page: number) {
  if (typeof window === "undefined") {
    return
  }

  const url = new URL(window.location.href)

  if (page <= 1) {
    url.searchParams.delete(pageQueryParam)
  } else {
    url.searchParams.set(pageQueryParam, String(page))
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (nextUrl !== currentUrl) {
    window.history.replaceState(window.history.state, "", nextUrl)
  }
}

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

  const pageFromUrl = getPageFromUrl()
  if (pageFromUrl) {
    currentPage.value = Math.min(pageFromUrl, totalPages.value)
  }
})

watch(
  [currentPage, totalPages],
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
      return
    }

    syncPageToUrl(currentPage.value)
  },
)
</script>

<template>
  <div>
    <div :class="styles.postList">
      <article v-for="post in pagedPosts" :key="post.url" :class="styles.postItem">
      <a
        :class="[styles.postLink, !post.date && !post.image && styles.postLinkNoMeta]"
        :href="post.url"
        @click="markVisited(post.url)"
      >
        <div v-if="post.date || post.image" :class="styles.postMetaColumn">
          <div v-if="post.date" :class="styles.postMeta">{{ formatDate(post.date) }}</div>
          <div v-if="post.image" :class="styles.postThumbFrame">
            <img :src="post.image" :alt="`${post.title} thumbnail`" :class="styles.postThumb" />
          </div>
        </div>
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
          <p :class="styles.postExcerpt">{{ post.description }}</p>
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

    <nav v-if="totalPages > 1" :class="styles.pagination" aria-label="Post list pagination">
      <button
        type="button"
        :class="styles.paginationButton"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>

      <span :class="styles.paginationLabel">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        type="button"
        :class="styles.paginationButton"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </div>
</template>