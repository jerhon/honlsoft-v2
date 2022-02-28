import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout/layout"
import PageHeader from "../components/page-header"
import Pager from "../components/pager"
import SEO from "../components/layout/seo"
import { capitalize, getPostUrl } from "../utils"
import { PageLength } from "../const"
import { PostItem, PostItemProps } from "../components/post-item"
import { Container } from "../components/container"
import { BreadcrumbInfo } from "../components/breadcrumb"


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

interface PostListPageProps {
  posts: PostItemProps[]
  backUrl?: string
  forwardUrl?: string
  title: string
  breadcrumbs: BreadcrumbInfo[]
}

function PostListPage(props: PostListPageProps) {


  let postLayout = props.posts
    .slice(0, Math.min(props.posts.length, PageLength))
    .map((a) =>
      <PostItem key={a.url} {...a} />
    )

  return (
    <Layout isDocked={true}>
      <SEO title={props.title} />
      <PageHeader title={props.title} breadcrumbs={props.breadcrumbs} />
      <Container>
        {postLayout}
        <Pager backUrl={props.backUrl} forwardUrl={props.forwardUrl} />
      </Container>
    </Layout>
  )
}

function PostList({ data, location } : {data: any, location: any}) {
  let posts : PostItemProps[] = data.allMarkdownRemark.edges.map((n:any) => ({
    excerpt: n.node.excerpt,
    readTime: n.node.timeToRead,
    title: n.node.frontmatter.title,
    date: n.node.frontmatter.date,
    url: getPostUrl(n.node),
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

  return <PostListPage posts={posts} title={title} breadcrumbs={breadcrumbs} backUrl={backUrl} forwardUrl={forwardUrl} />
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
