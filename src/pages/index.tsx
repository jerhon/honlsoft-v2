import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import TitlePicture from "../components/title-picture"
import ResponsiveGrid from "../components/responsive-grid"
import LinkCard from "../components/link-card"
import RecentArticles from "../components/recent-articles"
import { Link } from "gatsby"
import { BlueSection } from "../components/blue-section"

export class IndexPage extends React.Component {

  render() {
    return (<Layout>
      <SEO title="Home" />
      <TitlePicture tagLine="Building software shouldn't feel like climbing a mountain." />
      <BlueSection>
        <h3>Find out more...</h3>
      </BlueSection>
      <div className="larger-page-width">
          <ResponsiveGrid>
            <LinkCard title="Blog" icon="/img/article.svg"
                      description="I write various articles about technical and personal projects that intrigue me.  Check out what I've been learning about lately."
                      url="/blog" />
            <LinkCard title="Projects" icon="/img/folder.svg"
                      description="See the past personal projects I have worked on." url="/projects" />
            <LinkCard title="About Me" icon="/img/account-circle.svg"
                      description="My personal profile.  Learn all about how I started coding, and what I'm doing now."
                      url="/about" />
          </ResponsiveGrid>
      </div>
      <BlueSection>
        <h3>Read recent posts...</h3>
      </BlueSection>
      <div className="page-width">
        <RecentArticles />
        <Link to="/blog">See more posts...</Link>
      </div>
    </Layout>)
  }
}

export default IndexPage
