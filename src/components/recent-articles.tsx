import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

export interface Article {
    title: string,
    excerpt: string,
    readTime: string,
    date: string,
    url: string
}


class RecentArticles extends React.Component<{ articles: Article[] }> {
    renderArticle(a: Article) {
        return (<div>
            <Link to={a.url}><h3>{a.title}</h3></Link>
            <p>{a.excerpt}</p>
            <div>{a.date} | approximately {a.readTime} minutes to read</div>
            <br />
            <hr />
        </div>);
    }

    renderAllArticles() {
        return this.props.articles.map((a) => this.renderArticle(a));
    }

    render() {
        return (<div>
            {this.renderAllArticles()}
        </div>);
    }
}

const PostLookup = () => {
    let data = useStaticQuery(graphql`
    {
        allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, limit: 5) {
            edges {
            node {
                excerpt(pruneLength: 240)
                timeToRead
                frontmatter {
                    date(formatString: "MMMM DD, YYYY"),
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
    }`);

    console.log(data);

    let articleData = data.allMarkdownRemark.edges.map((d) => ({ 
        title: d.node.frontmatter.title, 
        date: d.node.frontmatter.date,
        excerpt: d.node.excerpt,
        readTime: d.node.timeToRead,
        url: '/blog/' + d.node.parent.name
    }))

    console.log(articleData);

    return (<RecentArticles articles={articleData}></RecentArticles>)
}

export default PostLookup;