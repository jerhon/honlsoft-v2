import React from "react"
import Layout from "../components/layout/layout"
import SEO from "../components/seo"
import TitlePicture from "../components/title-picture"
import LinkCard from "../components/link-card"
import RecentArticles from "../components/recent-articles"
import { Link } from "gatsby"
import MuiLink from "@material-ui/core/Link"

import "intersection-observer"
import {
  GoBook, GoFile, GoQuestion
} from "react-icons/go"
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
                icon={<GoBook size={100} />}
                description="I write various articles about technical and personal projects that intrigue me.  Check out what I've been learning about lately."
                url="/blog"
              />
            </Grid>
            <Grid item className={styles.linkCard} xs={12} md={4}>
              <LinkCard
                title="Projects"
                icon={<GoFile size={100} />}
                description="See the past personal projects I have worked on."
                url="/projects"
              />
            </Grid>
            <Grid item className={styles.linkCard} xs={12} md={4}>
              <LinkCard
                title="About Me"
                icon={<GoQuestion size={100} />}
                description="My personal profile.  Learn all about how I started coding, and what I'm doing now."
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
