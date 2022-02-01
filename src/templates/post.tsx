import { graphql } from "gatsby"
import React from "react"

import Layout from "../components/layout/layout"
import PageHeader from "../components/page-header"
import RelatedPosts from "../components/related-posts"
import SEO from "../components/layout/seo"
import { getPostBreadcrumbs, getPostUrl } from "../utils"
import { Container } from "../components/container"

interface PostLink {
  title: string,
  url: string
}


interface Post {
  imageUrl?: string,
  title: string,
  date: string,
  description: string,
  html: string

  breadcrumbs?: PostLink[]
  relatedPosts?: PostLink[]
}

function Post(post: Post) {
  return <Layout>
    <SEO title={post.title} description={post.description} image={post?.imageUrl} />
    <article>
      <PageHeader title={post.title} breadcrumbs={post.breadcrumbs} />
      <Container>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.relatedPosts && <RelatedPosts links={post.relatedPosts} />}
      </Container>
    </article>
  </Layout>
}


const PostTemplate = ({ data: { post, relatedPosts } } : any) => {

  let links: PostLink[] = []
  if (relatedPosts && relatedPosts.edges && relatedPosts.edges.length) {
    links = relatedPosts.edges.map((post : any) => ({
      title: post.node.frontmatter.title,
      url: getPostUrl(post.node),
    }))
  }

  let breadcrumbs = getPostBreadcrumbs(post)

  const postData = {
    imageUrl: post.frontmatter?.image?.publicURL,
    title: post.frontmatter.title,
    date: post.frontmatter.date,
    description: post.frontmatter.description ?? post.description,
    html: post.html,
    breadcrumbs,
    relatedPosts: links
  };

  return <Post {...postData} />
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
