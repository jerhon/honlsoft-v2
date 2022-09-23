import { graphql } from "gatsby"
import React from "react"
import { PostListPage } from "../components/post-list"
import { markdownToPageListPage } from "./post-list"


function TagList({ data, pageContext } : {data: any, pageContext: any}) {
  const postListOptions = { ...markdownToPageListPage(data, pageContext.pagePath), title: "Blog Posts with Tag " + pageContext.tag };

  return <PostListPage {...postListOptions} />
}

export const tagListQuery = graphql`
  query tagListQuery($limit: Int!, $skip: Int!, $type: String!, $tag: String!) {
    allMarkdownRemark(
      filter: { frontmatter: { type: { eq: $type }, tags: { in: [$tag] } } }
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

export default TagList
