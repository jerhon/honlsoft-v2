import React, { useEffect, useRef, useState } from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"

import "intersection-observer"

import RecentPostsSection from "../components/index/recent-posts-section"
import { NavigationSection } from "../components/index/navigation-section"
import { TitleSectionV2 } from "../components/index/title-section-v2"

export function IndexPage() {

  const [isDocked, setIsDocked] = useState(false)
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.length >= 1) {
        setIsDocked(!entries[0].isIntersecting);
      }
    }, { threshold: 0.2 });

    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect();
  }, [])


  return (
    <Layout isDocked={isDocked}>
      <SEO title="Home" description="A personal website containing my musings on software development." />
      <div ref={ref}>
        <TitleSectionV2 />
      </div>
      <div  className="flex flex-col bg-slate-100">
        <NavigationSection />
      </div>
      <RecentPostsSection />
    </Layout>
  )
}

export default IndexPage
