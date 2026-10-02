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
  <div>
    <PostList :posts="visiblePosts" />

    <nav
      v-if="typeof props.limit !== 'number' && totalPages > 1"
      class="mt-8 mb-12 flex flex-wrap items-center justify-center gap-3 border-t border-[#dae4df] py-6"
      aria-label="Blog archive pagination"
    >
      <button
        type="button"
        class="group cursor-pointer rounded-md border border-[#dae4df] bg-white p-2.5 text-[#176c5b] transition hover:bg-[#e4f1ec] disabled:cursor-not-allowed disabled:opacity-45"
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

      <span class="text-sm font-semibold text-[#4f625d]">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        type="button"
        class="group cursor-pointer rounded-md border border-[#dae4df] bg-white p-2.5 text-[#176c5b] transition hover:bg-[#e4f1ec] disabled:cursor-not-allowed disabled:opacity-45"
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

      <span class="ml-3 hidden text-sm font-semibold text-[#697b75] lg:block">
        {{ posts.length }} total post<span v-if="posts.length !== 1">s</span>
      </span>
    </nav>
  </div>
</template>
