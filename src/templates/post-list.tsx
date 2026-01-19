import { graphql } from "gatsby"
import React from "react"
import { capitalize, getPostUrl } from "../utils"
import { PageLength } from "../const"
import { PostItemProps } from "../components/post-item"
import { PostListPage } from "../components/post-list"


function parseUrl(url: string) {
  let idx = 0
  let baseUrl = url
  if (url && url.lastIndexOf("/") > 0) {
    idx = +url.substring(url.lastIndexOf("/") + 1)
    if (!isNaN(idx))
    {
      baseUrl  = url.substring(0, url.lastIndexOf("/"))
    }
  }
  if (!baseUrl.endsWith("/"))
  {
    baseUrl += "/"
  }
  if (!idx) {
    idx = 0;
  }

  return { idx, baseUrl }
}

function getPagingUrls(url: string, count: number) {

  let {idx, baseUrl} = parseUrl(url);

  let backUrl :string | undefined
  let forwardUrl :string | undefined

  if (idx === 1) {
    backUrl = baseUrl
  } else if (idx > 1) {
    backUrl = baseUrl + (idx - 1).toString()
  }

  if (count > PageLength) {
    forwardUrl = baseUrl + (idx + 1)
  }

  return {
    forwardUrl,
    backUrl
  }
}


export function markdownToPageListPage(data: any, path: string) {
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


  let { backUrl, forwardUrl } = getPagingUrls(path, posts.length)

  return {
    posts,
    title,
    breadcrumbs,
    backUrl,
    forwardUrl
  }
}


function PostList({ data, pageContext } : {data: any, pageContext: any}) {
  const postListOptions = markdownToPageListPage(data, pageContext.pagePath);

  return <PostListPage {...postListOptions} />
}

export const postListQuery = graphql`
  query blogListQuery($limit: Int!, $skip: Int!, $type: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { type: { eq: $type } } }
      sort: { frontmatter: { date: DESC } }
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

