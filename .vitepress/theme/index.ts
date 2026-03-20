import DefaultTheme from "vitepress/theme"
import type { Theme } from "vitepress"

import Layout from "./Layout.vue"
import "./custom.css"

import BlogArchive from "./components/BlogArchive.vue"
import FitnessLinks from "./components/FitnessLinks.vue"
import HomeSections from "./components/HomeSections.vue"
import ProjectArchive from "./components/ProjectArchive.vue"
import RunningChart from "./components/RunningChart.vue"
import TagArchive from "./components/TagArchive.vue"
import TagDirectory from "./components/TagDirectory.vue"

const theme: Theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("BlogArchive", BlogArchive)
    app.component("FitnessLinks", FitnessLinks)
    app.component("HomeSections", HomeSections)
    app.component("ProjectArchive", ProjectArchive)
    app.component("RunningChart", RunningChart)
    app.component("TagArchive", TagArchive)
    app.component("TagDirectory", TagDirectory)
  },
}

export default theme
