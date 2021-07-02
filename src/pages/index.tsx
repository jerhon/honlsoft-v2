import React from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/seo"
import TitlePicture from "../components/title-picture"
import LinkCard from "../components/link-card"
import RecentArticles from "../components/recent-articles"
import { Link } from "gatsby"
import MuiLink from "@material-ui/core/Link"

import books from "./images/books.jpg"
import code from "./images/code.jpg"
import about from "./images/about.jpg"

import "intersection-observer"
import { AutoScrollDown } from "../components/autoscroll-down-button"
import { Container, Grid, makeStyles, Typography } from "@material-ui/core"
import { grey } from "@material-ui/core/colors"

const useStyles = makeStyles({
  root: {
    backgroundColor: grey[100]
  },
  linksPage: {
    minHeight: '100vh',
    padding: '16px 8px'
  },
  linkGrid: {
    marginTop: '8px',
    marginBottom: '8px'
  },
  linkCard: {
    maxHeight: '500px'
  },
  mountainsBackground: {
    backgroundImage: 'url(\'/img/mountains-dark-2.jpg\')'
  }
})

export function IndexPage() {
  const styles =  useStyles();

  return (
    <Layout>
      <SEO title="Home" description="A personal website containing my musings on software development." />
      <TitlePicture
        className={styles.mountainsBackground}
        tagLine="Building software shouldn't feel like climbing a mountain.">
        <AutoScrollDown id="nav" />
      </TitlePicture>
      <Container id="nav" >
        <Grid container className={styles.linksPage} direction="column" justify="space-evenly" alignItems="center">
          <Grid item>
            <Typography variant="h3" align="center">
              Learn More
            </Typography>
          </Grid>
          <Grid container item   alignItems="stretch" justify="space-between" spacing={8} className={styles.linkGrid}>
            <Grid item className={styles.linkCard} xs={12} md={4} >
              <LinkCard
                title="Blog"
                image={books}
                description="Take a look at what I've been learning about lately.  I blog about technical topics that intrigue me."
                url="/blog"
              />
            </Grid>
            <Grid item className={styles.linkCard} xs={12} md={4}>
              <LinkCard
                title="Projects"
                image={code}
                description="Learn about personal projects I have worked on in the past.  These are small projects I'm working on &quot;just for fun&quot; outside of my day job."
                url="/projects"
              />
            </Grid>
            <Grid item className={styles.linkCard} xs={12} md={4}>
              <LinkCard
                title="About Me"
                image={about}
                description="Learn all about how I started coding, and what I'm doing now."
                url="/about"
              />
            </Grid>
          </Grid>
          <Grid>
            <AutoScrollDown id="recentPosts" style="dark" />
          </Grid>
        </Grid>
        <Typography variant="h3" align="center" id="recentPosts">
          Recent Posts
        </Typography>
        <RecentArticles />
        <MuiLink component={Link} to="/blog" color="secondary">See more posts...</MuiLink>
      </Container>
    </Layout>
  )
}

export default IndexPage
