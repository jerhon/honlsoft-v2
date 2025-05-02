import { graphql } from "gatsby"
import React, { useLayoutEffect } from "react"

import Layout from "../components/layout/layout"
import "../styles/scientific-article.css"
import PageHeader from "../components/page-header"
import RelatedPosts from "../components/related-posts"
import SEO from "../components/layout/seo"
import { getPostBreadcrumbs, getPostUrl } from "../utils"
import mermaid from "mermaid";
import { LinkedInShareLink, TwitterShareLink } from "../components/share-link"

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

function ScientificPost(post: PostProps) {
  useLayoutEffect(() => {
    mermaid.initialize({ });
  }, []);

  useLayoutEffect(() => {
    mermaid.contentLoaded();
  });

  return <Layout isDocked={true}>
    <SEO title={post.title} description={post.description} image={post?.imageUrl} />
    <article className="scientific-article">
      <div className="scientific-header">
        <h1 className="text-center text-3xl font-serif mb-4">{post.title}</h1>
        <div className="text-center text-gray-600 mb-8 font-serif">{post.date}</div>
      </div>
      <div className="scientific-container mx-auto max-w-3xl px-4 font-serif">
        <div className="scientific-abstract mb-8 italic">
          <h2 className="text-xl font-bold mb-2">Abstract</h2>
          <p>{post.description}</p>
        </div>
        <div className="scientific-content" dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.relatedPosts && <div className="scientific-related mt-12 pt-8 border-t border-gray-300">
          <h2 className="text-xl font-bold mb-4">Related Works</h2>
          <RelatedPosts links={post.relatedPosts} />
        </div>}
        <div className="scientific-share mt-8 flex">
          <div className="flex text-xl space-x-2 ml-auto bg-gray-100 p-2 border border-gray-200 rounded-lg items-end">
            <div className="text-sm">Share this article: </div>
            <LinkedInShareLink url={post.url} />
            <TwitterShareLink url={post.url} title={post.title} />
          </div>
        </div>
      </div>
    </article>
  </Layout>
}

const ScientificPostTemplate = ({ data: { post, relatedPosts } } : any) => {

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

  return <ScientificPost {...postData} />
}

export const scientificPostQuery = graphql`
  query($id: String!, $project: [String]) {
    post: markdownRemark(id: { eq: $id }) {
      id
      html
      description: excerpt(truncate: true)
      frontmatter {
        title
        type
        date(formatString: "MMMM DD, YYYY")
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

export default ScientificPostTemplate
