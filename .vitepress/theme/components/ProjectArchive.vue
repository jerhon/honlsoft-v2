<script setup lang="ts">
import { data as projects } from "../data/projects.data"
</script>

<template>
  <div class="archive-grid">
    <article
      v-for="project in projects"
      :key="project.url"
      class="archive-card"
    >
      <h2 class="archive-card__title">
        <a class="archive-card__link" :href="project.url">{{
          project.title
        }}</a>
      </h2>

      <p class="archive-card__excerpt">{{ project.excerpt }}</p>
    </article>
  </div>
</template>
