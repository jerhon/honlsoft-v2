import { PostItem, PostItemProps } from "./post-item"
import { BreadcrumbInfo } from "../navigation/breadcrumb"
import { PageLength } from "../../const"
import Layout from "../layout/layout"
import SEO from "../layout/seo"
import PageHeader from "../layout/page-header"
import { Container } from "../ui/container"
import Pager from "./pager"
import React from "react"

interface PostListPageProps {
  posts: PostItemProps[]
  backUrl?: string
  forwardUrl?: string
  title: string
  breadcrumbs: BreadcrumbInfo[]
}

export function PostListPage(props: PostListPageProps) {
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

