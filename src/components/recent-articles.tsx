import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import styles from "./recent-articles.module.css"
import MuiLink from "@material-ui/core/Link";

export interface Article {
  title: string
  excerpt: string
  readTime: string
  date: string
  url: string
}

class RecentArticles extends React.Component<{ articles: Article[] }> {
  renderArticle(a: Article) {
    return (
      <div className={"recent-article " + styles.article} key={a.url}>
        <MuiLink component={Link} to={a.url} color="secondary">
          <h3>{a.title}</h3>
        </MuiLink>
        <p>{a.excerpt}</p>
        <div>
          {a.date} | approximately {a.readTime} minutes to read
        </div>
        <br />
        <hr />
      </div>
    )
  }

  componentDidMount() {
    const observer = new IntersectionObserver(
      entries => {
        entries
          .filter(e => e.isIntersecting)
          .forEach(e => {
            if (!e.target.classList.contains(styles.slideIn)) {
              e.target.classList.add(styles.slideIn)
            }
          })
      },
      { rootMargin: "0px 0px -10% 0px" }
    )

    const elements = document.getElementsByClassName("recent-article")
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i)
      if (element) {
        observer.observe(element)
      }
    }
  }

  renderAllArticles() {
    return this.props.articles.map(a => this.renderArticle(a))
  }

  render() {
    return <div className={styles.container}>{this.renderAllArticles()}</div>
  }
}

const PostLookup = () => {
  let data = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 5
        filter: { frontmatter: { type: { eq: "blog" } } }
      ) {
        edges {
          node {
            excerpt(pruneLength: 240)
            timeToRead
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
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
  `)

  let articleData = data.allMarkdownRemark.edges.map(d => ({
    title: d.node.frontmatter.title,
    date: d.node.frontmatter.date,
    excerpt: d.node.excerpt,
    readTime: d.node.timeToRead,
    url: "/blog/" + d.node.parent.name,
  }))

  return <RecentArticles articles={articleData}></RecentArticles>
}

export default PostLookup
