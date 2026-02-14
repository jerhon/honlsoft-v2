import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Section } from "./section"
import { PostItem, PostItemProps } from "../blog/post-item"
import { Container } from "../ui/container"
import { ScrollReveal } from "../ui/scroll-reveal"


const PostLookup = () => {
  let data = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        limit: 10
        filter: { frontmatter: { type: { eq: "blog" } } }
      ) {
        edges {
          node {
            excerpt(pruneLength: 240)
            timeToRead
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
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
  `)

  let articleData: PostItemProps[] = data.allMarkdownRemark.edges.map((d: any) => ({
    title: d.node.frontmatter.title,
    date: d.node.frontmatter.date,
    excerpt: d.node.excerpt,
    readTime: d.node.timeToRead,
    url: "/blog/" + d.node.parent.name,
    tags: d.node.frontmatter.tags
  }))

  return <div className="flex-col mt-16 mx-4">
    <Container>
      <ScrollReveal animation="fade-up">
        <h2 className="py-4 text-3xl font-bold">Recent Articles</h2>
      </ScrollReveal>
      <div>
        {articleData.map((a: any) => <PostItem key={a.url} {...a} />)}
      </div>
    </Container>
  </div>
}

export default PostLookup
