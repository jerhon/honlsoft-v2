import { graphql } from "gatsby"
import React, { useLayoutEffect} from "react"

import Layout from "../components/layout/layout"
import PageHeader from "../components/layout/page-header"
import RelatedPosts from "../components/blog/related-posts"
import SEO from "../components/layout/seo"
import { getPostBreadcrumbs, getPostUrl } from "../utils"
import { Container } from "../components/ui/container"
import mermaid from "mermaid";
import { LinkedInShareLink, TwitterShareLink } from "../components/blog/share-link"
import { ScrollReveal } from "../components/ui/scroll-reveal"
import "../styles/technical-article.css"

interface PostLink {
  title: string,
  url: string
}


interface PostProps {
  imageUrl?: string,
  title: string,
  date: string,
  description: string,
  html: string,
  url: string,

  breadcrumbs?: PostLink[]
  relatedPosts?: PostLink[]
}

function Post(post: PostProps) {
  useLayoutEffect(() => {
    mermaid.initialize({ });
  }, []);

  useLayoutEffect(() => {
    mermaid.contentLoaded();
  });

  return <Layout isDocked={true}>
    <SEO title={post.title} description={post.description} image={post?.imageUrl} />
    <ScrollReveal animation="slide-left">
      <article className="technical-article">
        <PageHeader title={post.title} breadcrumbs={post.breadcrumbs} />
        <Container>
          <div className="technical-content" dangerouslySetInnerHTML={{ __html: post.html }} />
          {post.relatedPosts && <RelatedPosts links={post.relatedPosts} />}
          <div className="desktop:sticky desktop:bottom-[0px]   -mb-4 flex">
            <div className="flex text-xl space-x-2 ml-auto bg-slate-100 p-2 border-t-2 border-x-2 border-gray-100 rounded-t-lg items-end ">
              <div className="text-sm">Share this post: </div>
              <LinkedInShareLink url={post.url} />
              <TwitterShareLink url={post.url} title={post.title} />
            </div>
          </div>
        </Container>
      </article>
    </ScrollReveal>
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
    url: 'https://www.honlsoft.com' + getPostUrl(post),
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
