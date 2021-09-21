import { graphql } from "gatsby"
import React from "react"

import Layout from "../components/layout/layout"
import PageHeader from "../components/page-header"
import RelatedPosts from "../components/related-posts"
import SEO from "../components/seo"
import { getPostBreadcrumbs, getPostUrl } from "../utils"
import { Container, createStyles, makeStyles } from "@material-ui/core"
import { linkStyles } from "../styles"


const useStyles = makeStyles((theme) =>
  createStyles({
    post: {
      ...linkStyles(theme.palette.secondary.dark)
    }
  }))

const PostTemplate = ({ data: { post, relatedPosts } }) => {
  const image = post.frontmatter?.image?.publicURL
  const title = post.frontmatter.title
  const date = post.frontmatter.date
  const description = post.frontmatter.description ?? post.description;
  const html = post.html
  const styles = useStyles();

  let links = []
  if (relatedPosts && relatedPosts.edges && relatedPosts.edges.length) {
    links = relatedPosts.edges.map(p => ({
      title: p.node.frontmatter.title,
      url: getPostUrl(p.node),
    }))
  }

  let breadcrumbs = getPostBreadcrumbs(post)

  return (
    <Layout>
      <SEO title={title} description={description} image={image} />
      <PageHeader title={title} breadcrumbs={breadcrumbs} />
      <Container>
        <div className={styles.post} dangerouslySetInnerHTML={{ __html: html }} />
        <RelatedPosts links={links} />
      </Container>
    </Layout>
  )
}

export const postQuery = graphql`
  query($id: String!, $project: [String]) {
    post: markdownRemark(id: { eq: $id }) {
      id
      html
      description: excerpt(truncate: true)
      frontmatter {
        title
        type
        date(formatString: "MMMM, DD, YYYY")
        tags
        page
        description
        image {
          publicURL
        }
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
    relatedPosts: allMarkdownRemark(
      filter: { frontmatter: { tags: { in: $project } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            type
          }
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  }
`

export default PostTemplate
