import type { Theme } from "vitepress"

import Layout from "./Layout.vue"
import "./tailwind.css"
import "./custom.css"

import BlogArchive from "./components/pages/BlogArchive.vue"
import FitnessLinks from "./components/FitnessLinks.vue"
import HeroSection from "./components/sections/HeroSection.vue"
import RecentPosts from "./components/sections/RecentPosts.vue"
import ProjectArchive from "./components/sections/ProjectArchive.vue"
import RunningChart from "./components/RunningChart.vue"
import TagArchive from "./components/TagArchive.vue"
import TagDirectory from "./components/TagDirectory.vue"

const theme: Theme = {
  Layout,
  enhanceApp({ app }) {
    app.component("BlogArchive", BlogArchive)
    app.component("FitnessLinks", FitnessLinks)
    app.component("HeroSection", HeroSection)
    app.component("RecentPosts", RecentPosts)
    app.component("ProjectArchive", ProjectArchive)
    app.component("RunningChart", RunningChart)
    app.component("TagArchive", TagArchive)
    app.component("TagDirectory", TagDirectory)
  },
}

export default theme
