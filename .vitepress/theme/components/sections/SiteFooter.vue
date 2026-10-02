<script setup lang="ts">
import styles from "./SiteFooter.module.css"

const year = new Date().getFullYear()
</script>

<template>
  <footer :class="styles.footer">
    <div :class="[styles.inner, 'hs-page-width px-4 sm:px-6 lg:px-8']">
      <div :class="styles.top">
        <div :class="styles.brand">
          <a href="/" :class="styles.name">Honlsoft</a>
          <p>Ideas, experiments, and practical notes on building software.</p>
        </div>

        <nav :class="styles.nav" aria-label="Footer">
          <a href="/blog/">Blog</a>
          <a href="/projects/">Projects</a>
          <a href="/tag/">Topics</a>
          <a href="/about">About</a>
          <a href="/links">Links</a>
        </nav>
      </div>

      <div :class="styles.bottom">
        <span>&copy; {{ year }} Jeremy Honl</span>
        <span>Built with curiosity.</span>
      </div>
    </div>
  </footer>
</template>