import React, { useEffect, useRef, useState } from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"

import RecentPostsSection from "../components/home/recent-posts-section"
import { NavigationSection } from "../components/home/navigation-section"
import { TitleSectionV2 } from "../components/home/title-section-v2"
import { WaveDivider } from "../components/ui/wave-divider"
import { ScrollReveal } from "../components/ui/scroll-reveal"

export function IndexPage() {

  const [isDocked, setIsDocked] = useState(false)
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.length >= 1) {
        setIsDocked(!entries[0].isIntersecting);
      }
    }, { threshold: 0.7 });

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
      
      {/* Wave transition from hero to navigation */}
      <WaveDivider color="#f1f5f9" direction="top" variant={1} />
      
      <ScrollReveal animation="fade-in">
        <div className="flex flex-col bg-slate-100 -mt-1">
          <NavigationSection />
        </div>
      </ScrollReveal>
      
      {/* Wave transition from navigation to recent posts */}
      <WaveDivider color="#ffffff" direction="top" variant={2} />
      
      <ScrollReveal animation="fade-up" delay={100}>
        <div className="bg-white -mt-1">
          <RecentPostsSection />
        </div>
      </ScrollReveal>
    </Layout>
  )
}

export default IndexPage
