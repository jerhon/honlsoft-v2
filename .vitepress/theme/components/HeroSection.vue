<template>
  <section
    class="hero-shell relative isolate overflow-hidden text-white"
    aria-label="Honlsoft introduction"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900"></div>
    <div class="hero-aurora hero-aurora--left"></div>
    <div class="hero-aurora hero-aurora--right"></div>
    <div class="hero-grid absolute inset-0 opacity-30"></div>

    <div
      class="hero-shell__content hs-page-width relative z-10 flex items-center px-6 py-24 sm:px-8 lg:px-12"
    >
      <div class="grid w-full gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div class="space-y-8">
          <div class="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
            <div
              class="hero-kicker hero-fade-up border-white/20 text-center lg:border-r lg:pr-8 lg:text-right"
            >
              <div class="font-title text-3xl font-bold sm:text-4xl lg:text-5xl">
                Jeremy's
              </div>
              <div class="hero-fade-up hero-delay-1 font-title text-3xl font-bold sm:text-4xl lg:text-5xl">
                Technology Blog
              </div>
            </div>

            <div class="space-y-4 text-center lg:text-left">
              <h1
                class="hero-fade-up hero-delay-2 font-title text-6xl font-bold leading-none sm:text-7xl lg:text-[5.5rem]"
              >
                Let's build software
              </h1>
              <p
                class="hero-fade-up hero-delay-3 font-title text-5xl font-bold leading-none text-blue-50 sm:text-6xl lg:text-7xl"
              >
                people <span class="hero-highlight">dream</span> of using.
              </p>
            </div>
          </div>

          <p
            class="hero-fade-up hero-delay-4 max-w-3xl text-lg leading-8 text-blue-50/85 sm:text-xl py-8">
            Practical notes on software architecture, .NET, containers, AI-assisted
            development, and the side projects that keep engineering fun.
          </p>

          <div
            class="hero-fade-up hero-delay-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            <a href="/blog/" class="hs-btn hs-btn-primary">
              Read the blog
            </a>
            <a href="/projects/" class="hs-btn hs-btn-secondary">
              View projects
            </a>
            <a href="/about" class="hs-btn hs-btn-subtle">
              About me
            </a>
          </div>

          <div
            class="hero-fade-up hero-delay-6 flex flex-wrap gap-3 pt-2 text-sm text-blue-100/80"
          >
            <span class="hs-chip">Software Architecture</span>
            <span class="hs-chip">.NET &amp; APIs</span>
            <span class="hs-chip">AI Tooling</span>
            <span class="hs-chip">Side Projects</span>
          </div>
        </div>

        <div class="hero-fade-up hero-delay-4 relative">
          <div class="hero-panel hs-panel p-6">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-300/10"></div>

            <div class="relative space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="mt-2 font-title text-2xl font-bold text-white">
                    What you'll find here
                  </p>
                </div>

                <div class="hs-card bg-white/10 px-4 py-3 text-center">
                  <p class="hs-meta-label text-blue-100/70">Focus</p>
                  <p class="mt-1 font-title text-xl font-bold text-white">Practical DX</p>
                </div>
              </div>

              <div class="space-y-4">
                <div class="hs-card p-4">
                  <p class="hs-meta-label text-blue-200/70">Recently</p>
                  <p class="mt-2 font-title text-xl font-bold text-white">
                    AI workflows and developer productivity
                  </p>
                  <p class="mt-2 text-sm leading-6 text-blue-50/75">
                    Notes on using Copilot agents, CLI workflows, and implementation
                    experiments that save real engineering time.
                  </p>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="hs-card-blue p-4">
                    <p class="hs-meta-label text-blue-200/70">Topics</p>
                    <p class="mt-2 text-3xl font-bold text-white">4+</p>
                    <p class="mt-1 text-sm text-blue-50/75">
                      architecture, containers, AI, and projects
                    </p>
                  </div>

                  <div class="hs-card-red p-4">
                    <p class="hs-meta-label text-red-200/70">Style</p>
                    <p class="mt-2 text-3xl font-bold text-white">Hands-on</p>
                    <p class="mt-1 text-sm text-blue-50/75">
                      implementation-first writeups with concrete examples
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-shell {
  min-height: calc(100svh - var(--vp-nav-height) - var(--vp-layout-top-height, 0px));
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 32%),
    radial-gradient(circle at 80% 18%, rgba(239, 68, 68, 0.18), transparent 24%);
}

.hero-shell__content {
  min-height: inherit;
}

.hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-position: center;
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent 82%);
}

.hero-aurora {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  opacity: 0.65;
}

.hero-aurora--left {
  left: -10rem;
  top: 4rem;
  height: 24rem;
  width: 24rem;
  background: rgba(59, 130, 246, 0.28);
  animation: driftLeft 18s ease-in-out infinite;
}

.hero-aurora--right {
  right: -6rem;
  bottom: 2rem;
  height: 22rem;
  width: 22rem;
  background: rgba(239, 68, 68, 0.24);
  animation: driftRight 16s ease-in-out infinite;
}

.hero-panel {
  transform: perspective(1400px) rotateY(-10deg) rotateX(4deg);
}

.hero-badge {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.03), 0 15px 40px rgba(15, 23, 42, 0.35);
}

.hero-kicker {
  text-shadow: 0 8px 28px rgba(15, 23, 42, 0.45);
}

.hero-highlight {
  position: relative;
  display: inline-block;
  background: linear-gradient(120deg, #f87171 0%, #ef4444 40%, #fca5a5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-highlight::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.35rem;
  height: 0.28rem;
  border-radius: 9999px;
  background: linear-gradient(120deg, #ef4444 0%, #fca5a5 100%);
  transform: scaleX(0);
  transform-origin: left;
  animation: underlineExpand 0.9s ease-out 1.2s forwards;
}

.hero-fade-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.hero-delay-1 {
  animation-delay: 0.15s;
}

.hero-delay-2 {
  animation-delay: 0.3s;
}

.hero-delay-3 {
  animation-delay: 0.45s;
}

.hero-delay-4 {
  animation-delay: 0.6s;
}

.hero-delay-5 {
  animation-delay: 0.75s;
}

.hero-delay-6 {
  animation-delay: 0.9s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(26px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes underlineExpand {
  to {
    transform: scaleX(1);
  }
}

@keyframes driftLeft {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(2rem, 1.5rem, 0) scale(1.08);
  }
}

@keyframes driftRight {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(-1.5rem, -2rem, 0) scale(1.06);
  }
}

@media (max-width: 1023px) {
  .hero-panel {
    transform: none;
  }
}
</style>
