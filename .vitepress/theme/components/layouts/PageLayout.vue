<template>
  <main class="hs-page-width px-4 sm:px-6 lg:px-8">
    <div class="pageLayoutContent">
      <Content />
    </div>
  </main>
</template>

<style scoped>
.pageLayoutContent {
  width: 100%;
  min-width: 0;
  padding-block: 2.5rem 4rem;
  color: var(--vp-c-text-2);
}

.pageLayoutContent :deep(h1:first-child) {
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
  font-family: "Lato", sans-serif;
  font-size: clamp(2.35rem, 4vw, 3.5rem);
  line-height: 1.15;
}

.pageLayoutContent :deep(h1:first-child + p) {
  margin: 0 0 2.5rem;
  font-size: 1.06rem;
  line-height: 1.7;
}

.pageLayoutContent :deep(a) {
  color: #176c5b;
}

.pageLayoutContent :deep(a:hover) {
  color: #a6503b;
}
</style>