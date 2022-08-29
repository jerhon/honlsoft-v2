import { graphql } from "gatsby"
import React from "react"
import { capitalize, getPostUrl } from "../utils"
import { PageLength } from "../const"
import { PostItemProps } from "../components/post-item"
import { PostListPage } from "../components/post-list"


function getUrls(idx: number, count: number, postType: string) {
  let baseUrl = "/" + postType + "/"

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
  if (count > PageLength) {
    forwardUrl = baseUrl + (idx + 1)
  }

  return {
    forwardUrl,
    backUrl
  }
}


export function markdownToPageListPage(data: any) {
  let posts : PostItemProps[] = data.allMarkdownRemark.edges.map((n:any) => ({
    excerpt: n.node.excerpt,
    readTime: n.node.timeToRead,
    title: n.node.frontmatter.title,
    date: n.node.frontmatter.date,
    url: getPostUrl(n.node),
    tags: n.node.frontmatter.tags
  }))

  let type: string = data.allMarkdownRemark.edges[0].node.frontmatter.type
  let breadcrumbs = [
    { title: "Home", url: "/" },
    { title: capitalize(type), url: "/" + type },
  ]
  let title = capitalize(type)
  let url: string = location.pathname
  let idx = +url.substring(url.lastIndexOf("/") + 1)
  let { backUrl, forwardUrl } = getUrls(idx, posts.length, type)

  return {
    posts,
    title,
    breadcrumbs,
    backUrl,
    forwardUrl
  }
}


function PostList({ data, location } : {data: any, location: any}) {
  const postListOptions = markdownToPageListPage(data);

  return <PostListPage {...postListOptions} />
}

export const postListQuery = graphql`
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
            tags
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
