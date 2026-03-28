<script setup lang="ts">
import { formatDate, type Content } from "../lib/content"
import styles from "./PostList.module.css"

const props = defineProps<{
  posts: Content[]
}>()
</script>

<template>
  <div :class="styles.postList">
    <article v-for="post in props.posts" :key="post.url" :class="styles.postItem">
      <a
        :class="[styles.postLink, !post.date && !post.image && styles.postLinkNoMeta]"
        :href="post.url"
      >
        <div v-if="post.date || post.image" :class="styles.postMetaColumn">
          <div v-if="post.date" :class="styles.postMeta">{{ formatDate(post.date) }}</div>
          <div v-if="post.image" :class="styles.postThumbFrame">
            <img :src="post.image" :alt="`${post.title} thumbnail`" :class="styles.postThumb" />
          </div>
        </div>
        <div :class="styles.postBody">
          <h3 :class="styles.postTitle">{{ post.title }}</h3>
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
</template>