import { graphql, Link } from "gatsby"
import React from "react"
import Layout from "../components/layout/layout"
import PageHeader from "../components/page-header"
import Pager from "../components/pager"
import SEO from "../components/seo"
import { capitalize, getPostUrl, singular } from "../utils"
import { Container, createStyles, makeStyles } from "@material-ui/core"
import { linkStyles } from "../styles"


let useStyles = makeStyles((theme) => createStyles({
  content: {
    ...linkStyles(theme.palette.secondary.main)
  },
  tiny: {
    fontSize: '0.8rem'
  }
}));

const PostList = ({ data, location }) => {
  let styles = useStyles();
  let posts = data.allMarkdownRemark.edges.map(n => ({
    excerpt: n.node.excerpt,
    timeToRead: n.node.timeToRead,
    title: n.node.frontmatter.title,
    date: n.node.frontmatter.date,
    url: getPostUrl(n.node),
  }))

  let type: string = data.allMarkdownRemark.edges[0].node.frontmatter.type

  let postLayout = posts.map(a => (
    <div key={a.url}>
      <Link to={a.url}>
        <h3>{a.title}</h3>
      </Link>
      <p>{a.excerpt}</p>
      <div className={styles.tiny}>
        {a.date} | approximately {a.timeToRead} minutes to read
      </div>
      <br />
      <hr />
    </div>
  ))

  let breadCrumbs = [
    { title: "Home", url: "/" },
    { title: capitalize(type), url: "/" + type },
  ]

  let titleType = singular(capitalize(type))
  let title = titleType + " Posts"

  // todo: split this all out into seperate logic

  let url: string = location.pathname
  let idx = +url.substring(url.lastIndexOf("/") + 1)
  let baseUrl = "/" + type + "/"

  let backUrl: string | undefined
  let forwardUrl: string | undefined

  if (idx) {
    if (idx > 1) {
      backUrl = baseUrl + (idx - 1).toString()
    } else if (idx == 1) {
      backUrl = baseUrl
    }
  }
  if (!idx) {
    idx = 0
  }
  if (posts.length > 10) {
    forwardUrl = baseUrl + (idx + 1)
  }

  return (
    <Layout>
      <SEO title={title} />
      <PageHeader title={title} breadcrumbs={breadCrumbs} />
      <Container className={styles.content}>
        {postLayout}
        <Pager backUrl={backUrl} forwardUrl={forwardUrl} />
      </Container>
    </Layout>
  )
}

export const postQuery = graphql`
  query blogListQuery($limit: Int!, $skip: Int!, $type: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { type: { eq: $type } } }
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(pruneLength: 480)
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            type
            page
          }
          internal {
            content
            description
            ignoreType
            mediaType
          }
          parent {
            id
            ... on File {
              id
              name
              ext
            }
          }
        }
      }
    }
  }
`

export default PostList
