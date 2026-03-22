<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useData } from "vitepress"
import mermaid from "mermaid"

const { page, frontmatter, site, theme } = useData()
const isMobileMenuOpen = ref(false)

type NavItem = {
  text: string
  link: string
}

type SocialLink = {
  icon?: string
  link: string
}

const layoutClass = computed(() => {
  return frontmatter.value.unstyled === true ? "hs-layout-unstyled" : undefined
})

const navItems = computed<NavItem[]>(() => {
  const navEntries = Array.isArray(theme.value.nav)
    ? (theme.value.nav as Array<Partial<NavItem>>)
    : []

  return Array.isArray(theme.value.nav)
    ? navEntries
        .map((item: Partial<NavItem>) => {
          if (
            typeof item?.text === "string" &&
            typeof item?.link === "string" &&
            item.text.length > 0 &&
            item.link.length > 0
          ) {
            return {
              text: item.text,
              link: item.link,
            }
          }

          return null
        })
        .filter((item: NavItem | null): item is NavItem => item !== null)
    : []
})

const githubLink = computed(() => {
  const links = Array.isArray(theme.value.socialLinks)
    ? (theme.value.socialLinks as SocialLink[])
    : []

  return links.find(link => link.icon === "github")?.link ?? null
})

const siteTitle = computed(() => site.value.title || "Honlsoft")

const mobileNavItems = computed(() => {
  return githubLink.value
    ? [
        ...navItems.value,
        {
          text: "GitHub",
          link: githubLink.value,
        },
      ]
    : navItems.value
})

function normalizePath(value: string) {
  if (!value) {
    return "/"
  }

  const withoutHash = value.split("#")[0] ?? value
  const withoutQuery = withoutHash.split("?")[0] ?? withoutHash

  if (withoutQuery === "/") {
    return "/"
  }

  return withoutQuery.endsWith("/") ? withoutQuery : `${withoutQuery}/`
}

function isActiveLink(link: string) {
  const currentPath = normalizePath(page.value.relativePath ? `/${page.value.relativePath.replace(/\.md$/, "")}` : page.value.filePath)
  const currentRoute = normalizePath(page.value.filePath)
  const target = normalizePath(link)

  if (target === "/") {
    return currentPath === "/" || currentRoute === "/"
  }

  return currentPath === target || currentRoute === target || currentPath.startsWith(target)
}

function isGithubItem(link: string) {
  return githubLink.value !== null && link === githubLink.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function syncBodyScrollLock() {
  if (typeof document === "undefined") {
    return
  }

  document.body.style.overflow = isMobileMenuOpen.value ? "hidden" : ""
}

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeMobileMenu()
  }
}

function handleResize() {
  if (typeof window !== "undefined" && window.innerWidth > 959) {
    closeMobileMenu()
  }
}

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "neutral",
})

async function renderMermaid() {
  if (typeof window === "undefined") {
    return
  }

  await nextTick()

  document
    .querySelectorAll<HTMLElement>(".mermaid[data-processed]")
    .forEach(node => {
      node.removeAttribute("data-processed")
    })

  await mermaid.run({
    querySelector: ".mermaid",
  })
}

onMounted(() => {
  void renderMermaid()
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleEscapeKey)
    window.addEventListener("resize", handleResize)
  }
  syncBodyScrollLock()
})

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleEscapeKey)
    window.removeEventListener("resize", handleResize)
  }

  if (typeof document !== "undefined") {
    document.body.style.overflow = ""
  }
})

watch(
  () => page.value.relativePath,
  () => {
    closeMobileMenu()
    void renderMermaid()
  },
)

watch(isMobileMenuOpen, () => {
  syncBodyScrollLock()
})
</script>

<template>
  <div :class="['hs-layout', layoutClass]">
    <header v-if="frontmatter.unstyled !== true" class="hs-titlebar-wrap">
      <div class="hs-titlebar hs-page-width px-4 sm:px-6 lg:px-8">
        <a class="hs-titlebar__brand" href="/" aria-label="Go to homepage">
          <img class="hs-titlebar__logo" src="/img/honlsoft.svg" alt="Honlsoft logo" />
          <div>
            <p class="hs-titlebar__title">{{ siteTitle }}</p>
          </div>
        </a>

        <nav class="hs-titlebar__nav" aria-label="Primary">
          <a
            v-for="item in navItems"
            :key="item.link"
            :href="item.link"
            :class="['hs-titlebar__link', isActiveLink(item.link) && 'is-active']"
          >
            {{ item.text }}
          </a>
        </nav>

        <div class="hs-titlebar__actions">
          <a
            v-if="githubLink"
            class="hs-titlebar__github"
            :href="githubLink"
            aria-label="GitHub"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.25 3.32.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.17a11.02 11.02 0 0 1 5.78 0c2.2-1.48 3.17-1.17 3.17-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.41-2.7 5.39-5.27 5.67.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
              />
            </svg>
          </a>

          <button
            type="button"
            class="hs-titlebar__menu-toggle"
            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            aria-controls="hs-mobile-menu"
            aria-label="Toggle navigation menu"
            @click="toggleMobileMenu"
          >
            <span :class="['hs-titlebar__menu-line', isMobileMenuOpen && 'is-open']"></span>
            <span :class="['hs-titlebar__menu-line', isMobileMenuOpen && 'is-open']"></span>
            <span :class="['hs-titlebar__menu-line', isMobileMenuOpen && 'is-open']"></span>
          </button>
        </div>
      </div>
    </header>

    <transition name="hs-mobile-menu-fade">
      <div
        v-if="frontmatter.unstyled !== true && isMobileMenuOpen"
        id="hs-mobile-menu"
        class="hs-mobile-menu"
      >
        <button
          type="button"
          class="hs-mobile-menu__backdrop"
          aria-label="Close navigation menu"
          @click="closeMobileMenu"
        ></button>

        <div class="hs-mobile-menu__panel">
          <div class="hs-mobile-menu__header">
            <p class="hs-mobile-menu__title">{{ siteTitle }}</p>
            <button
              type="button"
              class="hs-mobile-menu__close"
              aria-label="Close navigation menu"
              @click="closeMobileMenu"
            >
              <span></span>
              <span></span>
            </button>
          </div>

          <nav class="hs-mobile-menu__nav" aria-label="Mobile primary">
            <a
              v-for="item in mobileNavItems"
              :key="item.link"
              :href="item.link"
              :class="[
                'hs-mobile-menu__link',
                isActiveLink(item.link) && 'is-active',
                isGithubItem(item.link) && 'hs-mobile-menu__link--github',
              ]"
              @click="closeMobileMenu"
            >
              <template v-if="isGithubItem(item.link)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.25 3.32.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.17a11.02 11.02 0 0 1 5.78 0c2.2-1.48 3.17-1.17 3.17-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.41-2.7 5.39-5.27 5.67.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                  />
                </svg>
                <span class="hs-mobile-menu__sr-only">GitHub</span>
              </template>
              <template v-else>
                {{ item.text }}
              </template>
            </a>
          </nav>
        </div>
      </div>
    </transition>

    <main class="hs-layout__content">
      <Content />
    </main>
  </div>
</template>
