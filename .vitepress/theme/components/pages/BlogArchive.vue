<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"

import { data as posts } from "../../data/posts.data"
import PostList from "../PostList.vue"

const props = withDefaults(defineProps<{ limit?: number }>(), {
  limit: undefined,
})

const pageSize = 20
const currentPage = ref(1)
const pageQueryParam = "page"

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(posts.length / pageSize))
})

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

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value)
}

const visiblePosts = computed(() => {
  if (typeof props.limit === "number") {
    return posts.slice(0, props.limit)
  }

  const start = (currentPage.value - 1) * pageSize
  return posts.slice(start, start + pageSize)
})

onMounted(() => {
  if (typeof props.limit === "number") {
    return
  }

  const pageFromUrl = getPageFromUrl()
  if (pageFromUrl) {
    currentPage.value = Math.min(pageFromUrl, totalPages.value)
  }
})

watch(
  [currentPage, totalPages, () => props.limit],
  () => {
    if (typeof props.limit === "number") {
      return
    }

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
      return
    }

    syncPageToUrl(currentPage.value)
  },
)
</script>

<template>
  <div class="pb-24">
    <PostList :posts="visiblePosts" />

    <nav
      v-if="typeof props.limit !== 'number' && totalPages > 1"
      class="fixed inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-center gap-2 border-t border-b border-slate-400/20 bg-[rgba(9,21,40,0.9)] px-3 py-3 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-4 md:gap-4 md:px-6 md:py-5 lg:pr-40"
      aria-label="Blog archive pagination"
    >
      <button
        type="button"
        class="group cursor-pointer rounded-full border border-slate-400/25 bg-slate-900/50 p-2.5 text-blue-100 transition duration-200 hover:border-blue-300/50 hover:bg-slate-800/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-45 sm:p-3 md:p-3.5"
        :disabled="currentPage === 1"
        aria-label="Previous page"
        @click="goToPage(currentPage - 1)"
      >
        <span class="relative block h-5 w-5 overflow-hidden sm:h-6 sm:w-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            class="absolute inset-0 h-full w-full transition duration-300 group-hover:-translate-x-1 group-hover:scale-110 group-focus-visible:-translate-x-1 group-focus-visible:scale-110"
          >
            <path
              d="M15 5 8 12l7 7"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            class="absolute inset-0 h-full w-full translate-x-3 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            <path
              d="M15 5 8 12l7 7"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
            />
          </svg>
        </span>
      </button>

      <span class="text-sm font-semibold text-slate-300 sm:text-sm md:text-base">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        type="button"
        class="group cursor-pointer rounded-full border border-slate-400/25 bg-slate-900/50 p-2.5 text-blue-100 transition duration-200 hover:border-blue-300/50 hover:bg-slate-800/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-45 sm:p-3 md:p-3.5"
        :disabled="currentPage === totalPages"
        aria-label="Next page"
        @click="goToPage(currentPage + 1)"
      >
        <span class="relative block h-5 w-5 overflow-hidden sm:h-6 sm:w-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            class="absolute inset-0 h-full w-full transition duration-300 group-hover:translate-x-1 group-hover:scale-110 group-focus-visible:translate-x-1 group-focus-visible:scale-110"
          >
            <path
              d="m9 5 7 7-7 7"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            class="absolute inset-0 h-full w-full -translate-x-3 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            <path
              d="m9 5 7 7-7 7"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
            />
          </svg>
        </span>
      </button>

      <span class="absolute right-6 hidden text-sm font-semibold text-slate-300 lg:block">
        {{ posts.length }} total post<span v-if="posts.length !== 1">s</span>
      </span>
    </nav>
  </div>
</template>
