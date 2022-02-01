import React from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"

import "intersection-observer"

import "../shared.css";
import RecentPostsSection from "../components/index/recent-posts-section"
import { TitleSection } from "../components/index/title-section"
import { NavigationSection } from "../components/index/navigation-section"

export function IndexPage() {
  return (
    <Layout>
      <SEO title="Home" description="A personal website containing my musings on software development." />
      <TitleSection />
      <NavigationSection />
      <RecentPostsSection />
    </Layout>
  )
}

export default IndexPage
