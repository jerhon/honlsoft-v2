<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useData } from "vitepress"
import styles from "./SiteNavbar.module.css"

const { page, site, theme } = useData()
const isMobileMenuOpen = ref(false)

type NavItem = {
  text: string
  link: string
}

type SocialLink = {
  icon?: string
  link: string
}

const navItems = computed<NavItem[]>(() => {
  const navEntries = Array.isArray(theme.value.nav)
    ? (theme.value.nav as Array<Partial<NavItem>>)
    : []

  return navEntries
    .map((item: Partial<NavItem>) => {
      if (
        typeof item.text === "string" &&
        typeof item.link === "string" &&
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
  const currentPath = normalizePath(
    page.value.relativePath
      ? `/${page.value.relativePath.replace(/\.md$/, "")}`
      : page.value.filePath,
  )
  const currentRoute = normalizePath(page.value.filePath)
  const target = normalizePath(link)

  if (target === "/") {
    return currentPath === "/" || currentRoute === "/"
  }

  return (
    currentPath === target ||
    currentRoute === target ||
    currentPath.startsWith(target)
  )
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

onMounted(() => {
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
  },
)

watch(isMobileMenuOpen, () => {
  syncBodyScrollLock()
})
</script>

<template>
  <header :class="styles.titlebarWrap">
    <div :class="[styles.titlebar, 'hs-page-width px-4 sm:px-6 lg:px-8']">
      <a :class="styles.brand" href="/" aria-label="Go to homepage">
        <img :class="styles.logo" src="/img/honlsoft.svg" alt="Honlsoft logo" />
        <div>
          <p :class="styles.title">{{ siteTitle }}</p>
        </div>
      </a>

      <nav :class="styles.nav" aria-label="Primary">
        <a
          v-for="item in navItems"
          :key="item.link"
          :href="item.link"
          :class="[styles.link, isActiveLink(item.link) && styles.linkActive]"
        >
          {{ item.text }}
        </a>
      </nav>

      <div :class="styles.actions">
        <a
          v-if="githubLink"
          :class="styles.github"
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
          :class="styles.menuToggle"
          :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
          aria-controls="hs-mobile-menu"
          aria-label="Toggle navigation menu"
          @click="toggleMobileMenu"
        >
          <span :class="[styles.menuLine, isMobileMenuOpen && styles.menuLineOpen]"></span>
          <span :class="[styles.menuLine, isMobileMenuOpen && styles.menuLineOpen]"></span>
          <span :class="[styles.menuLine, isMobileMenuOpen && styles.menuLineOpen]"></span>
        </button>
      </div>
    </div>
  </header>

  <transition
    :enter-active-class="styles.mobileMenuFadeEnterActive"
    :leave-active-class="styles.mobileMenuFadeLeaveActive"
    :enter-from-class="styles.mobileMenuFadeEnterFrom"
    :leave-to-class="styles.mobileMenuFadeLeaveTo"
  >
    <div v-if="isMobileMenuOpen" id="hs-mobile-menu" :class="styles.mobileMenu">
      <button
        type="button"
        :class="styles.mobileMenuBackdrop"
        aria-label="Close navigation menu"
        @click="closeMobileMenu"
      ></button>

      <div :class="styles.mobileMenuPanel">
        <div :class="styles.mobileMenuHeader">
          <p :class="styles.mobileMenuTitle">{{ siteTitle }}</p>
          <button
            type="button"
            :class="styles.mobileMenuClose"
            aria-label="Close navigation menu"
            @click="closeMobileMenu"
          >
            <span></span>
            <span></span>
          </button>
        </div>

        <nav :class="styles.mobileMenuNav" aria-label="Mobile primary">
          <a
            v-for="item in mobileNavItems"
            :key="item.link"
            :href="item.link"
            :class="[
              styles.mobileMenuLink,
              isActiveLink(item.link) && styles.mobileMenuLinkActive,
              isGithubItem(item.link) && styles.mobileMenuGithub,
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
              <span :class="styles.srOnly">GitHub</span>
            </template>
            <template v-else>
              {{ item.text }}
            </template>
          </a>
        </nav>
      </div>
    </div>
  </transition>
</template>