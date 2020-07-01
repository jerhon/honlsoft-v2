import React from "react";
import { Layout } from "../components/layout";
import { graphql, Link, useStaticQuery } from "gatsby";
import PageHeader from "../components/page-header";
import { singular, capitalize, getPostUrl } from "../utils";



const PostList = ({data}) => {


    let posts = data.allMarkdownRemark.edges.map((n) => ({
        excerpt: n.node.excerpt,
        timeToRead: n.node.timeToRead,
        title: n.node.frontmatter.title,
        date: n.node.frontmatter.date,
        url: getPostUrl(n.node)
    }));

    let type: string = data.allMarkdownRemark.edges[0].node.frontmatter.type;
    
    let postLayout = posts.map((a) => (<div>
        <Link to={a.url}><h3>{a.title}</h3></Link>
        <p>{a.excerpt}</p>
        <div>{a.date} | approximately {a.timeToRead} minutes to read</div>
        <br />
        <hr />
    </div>))

    let breadCrumbs = [
        {title:"Home", url:"/"}, 
        {title:capitalize(type), url: "/" + type}
    ];

    let titleType = singular(capitalize(type));

    return (<Layout>
        <PageHeader title={titleType + " Posts"} breadcrumbs={breadCrumbs} />
        <div className="page-width">
            {postLayout}
        </div>
        <div>
        </div>
    </Layout>)
}

export const postQuery = graphql`
query blogListQuery($limit: Int!, $skip: Int!, $type: String!)
{
    allMarkdownRemark(
        filter: {frontmatter: {type: {eq: $type }}}
        sort: {order: DESC, fields: [frontmatter___date]}, limit: $limit, skip: $skip) {
        edges {
            node {
                excerpt(pruneLength: 240)
                timeToRead
                frontmatter {
                    date(formatString: "MMMM DD, YYYY"),
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
}`;

export default PostList;