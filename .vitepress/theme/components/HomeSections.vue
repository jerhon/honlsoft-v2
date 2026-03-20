<script setup lang="ts">
import { computed } from "vue"

import { data as posts } from "../data/posts.data"
import { data as projects } from "../data/projects.data"
import { formatDate } from "../lib/content"

const recentPosts = computed(() => posts.slice(0, 4))
const featuredProjects = computed(() => projects.slice(0, 3))
</script>

<template>
  <section class="home-section">
    <h2 class="home-section__title">Explore the site</h2>
    <p class="home-section__lead">
      Honlsoft collects technical notes, project writeups, and a few personal
      pages for software development and side projects.
    </p>

    <div class="home-section__grid">
      <article class="home-section__card">
        <h3 class="home-section__title">Blog</h3>
        <p>
          Deep dives on .NET, containers, AI tooling, architecture, and software
          development practices.
        </p>
        <a class="home-section__link" href="/blog/">Browse blog posts</a>
      </article>

      <article class="home-section__card">
        <h3 class="home-section__title">Projects</h3>
        <p>
          Selected side projects, experiments, and implementation writeups from
          the Honlsoft archive.
        </p>
        <a class="home-section__link" href="/projects/">See projects</a>
      </article>

      <article class="home-section__card">
        <h3 class="home-section__title">About</h3>
        <p>Background, experience, and the motivation behind the site.</p>
        <a class="home-section__link" href="/about">Read the about page</a>
      </article>
    </div>
  </section>

  <section class="home-section">
    <h2 class="home-section__title">Recent posts</h2>

    <div class="archive-grid">
      <article v-for="post in recentPosts" :key="post.url" class="archive-card">
        <h3 class="archive-card__title">
          <a class="archive-card__link" :href="post.url">{{ post.title }}</a>
        </h3>
        <p class="archive-card__meta">{{ formatDate(post.date) }}</p>
        <p class="archive-card__excerpt">{{ post.excerpt }}</p>
      </article>
    </div>
  </section>

  <section class="home-section">
    <h2 class="home-section__title">Featured projects</h2>

    <div class="archive-grid">
      <article
        v-for="project in featuredProjects"
        :key="project.url"
        class="archive-card"
      >
        <h3 class="archive-card__title">
          <a class="archive-card__link" :href="project.url">{{
            project.title
          }}</a>
        </h3>
        <p class="archive-card__excerpt">{{ project.excerpt }}</p>
      </article>
    </div>
  </section>
</template>
