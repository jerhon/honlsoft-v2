<script setup lang="ts">
import RelatedPosts from "../RelatedPosts.vue"
import { tagToSlug } from "../../lib/content"
import { useArticleLayout } from "../../lib/useArticleLayout"
import styles from "./ScientificArticleLayout.module.css"

const { activeLink, contentRef, description, headers, publishedOn, tags, title } =
  useArticleLayout()
</script>

<template>
  <div :class="styles.root">
    <section :class="[styles.hero, 'hs-page-width px-6 sm:px-8 lg:px-12']">
      <nav :class="styles.breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/blog/">Blog</a>
      </nav>

      <div :class="styles.heroCard">
        <p :class="styles.kicker">Scientific article</p>
        <h1 :class="styles.title">{{ title }}</h1>

        <p v-if="publishedOn" :class="styles.meta">Published {{ publishedOn }}</p>

        <div v-if="tags.length" :class="styles.tags">
          <a
            v-for="tag in tags"
            :key="tag"
            :class="styles.tag"
            :href="`/tag/${tagToSlug(tag)}`"
          >
            {{ tag }}
          </a>
        </div>
      </div>
    </section>

    <div
      :class="[
        styles.body,
        !headers.length && styles.bodyNoAside,
        'hs-page-width px-4 sm:px-6 lg:px-8',
      ]"
    >
      <div :class="styles.main">
        <article :class="styles.paper">
          <section v-if="description" :class="styles.abstract">
            <p :class="styles.abstractLabel">Abstract</p>
            <p :class="styles.abstractText">{{ description }}</p>
          </section>

          <div ref="contentRef">
            <Content :class="['vp-doc', styles.content]" />
          </div>
        </article>

        <RelatedPosts />
      </div>

      <aside v-if="headers.length" :class="styles.aside">
        <div :class="styles.asideCard">
          <p :class="styles.asideTitle">Contents</p>

          <ul :class="styles.outline">
            <li v-for="header in headers" :key="header.link">
              <a
                :class="[
                  styles.outlineLink,
                  activeLink === header.link && styles.outlineLinkActive,
                  header.level === 3 && styles.outlineLinkNested,
                ]"
                :href="header.link"
              >
                {{ header.title }}
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>