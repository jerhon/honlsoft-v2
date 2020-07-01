import React from "react";
import { Layout } from "../components/layout";
import { graphql } from "gatsby";
import SEO from "../components/seo";
import PageHeader from "../components/page-header";
import RelatedPosts from "../components/related-posts";
import { getPostBreadcrumbs, getPostUrl } from "../utils";



const PostTemplate = ({ data: { post, relatedPosts } }) => {
	const title = post.frontmatter.title;
	const date = post.frontmatter.date;
    const html = post.html;

    let links = relatedPosts.edges.map((p) => ({ 
        title: p.node.frontmatter.title, 
        url:  getPostUrl(post.node)
    }));
    
    let breadcrumbs = getPostBreadcrumbs(post);

	return (
        <Layout>
            <SEO title={title}></SEO>
            <PageHeader title={title} breadcrumbs={breadcrumbs} />
            
            <div className="page-width">
                <div dangerouslySetInnerHTML={{ __html: html }} />
                
            <RelatedPosts links={links} />
            </div>

        </Layout>
	);
};

export const postQuery = graphql`
    query($id: String!, $project: [String]) {
		post: markdownRemark(id: { eq: $id }) {
			html
			frontmatter {
                title
                type
				date(formatString: "MMMM, DD, YYYY")
                tags
                page
            }
            parent {
                id
                ... on File {
                    id
                    name
                    ext
                }
            }
        },
        relatedPosts: allMarkdownRemark(
            filter: { frontmatter: { tags: {in: $project}}}
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
`;

export default PostTemplate;