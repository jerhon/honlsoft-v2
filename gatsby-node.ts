/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
import { CreatePagesArgs, GatsbyNode } from "gatsby"
import { tagToUrl } from "./src/tags"


type actionsType = CreatePagesArgs["actions"]
type graphQueryType = CreatePagesArgs["graphql"]

// You can delete this file if you're not using it

const path = require("path")

async function createBlogArticles(actions: actionsType, graphql: graphQueryType, reporter: any) {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/post.tsx`)
  const scientificPostTemplate = path.resolve(`src/templates/scientific-post.tsx`)
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        edges {
          node {
            id
            frontmatter {
              date
              type
              project
              page
              template
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
  `) as any
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  result.data.allMarkdownRemark.edges.forEach(({ node } : any) => {
    let url = ""
    if (node.frontmatter.page) {
      url = node.frontmatter.page
    } else {
      url = node.frontmatter.type + "/" + node.parent.name
    }

    // Use the scientific template if specified in frontmatter, otherwise use the default blog post template
    const template = node.frontmatter.template === 'scientific' ? scientificPostTemplate : blogPostTemplate;

    createPage({
      path: url,
      component: template,
      context: {
        id: node.id,
        project: node.frontmatter.project ?? "no-project",
        pagePath: "/" + url
      }, // additional data can be passed via context
    })
  })
}


async function createPaginatedForType(actions: actionsType, graphql: graphQueryType, type: string) {
  let { createPage } = actions

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {frontmatter: {type: {eq: "` +
      type +
      `"}}}
          sort: { frontmatter: { date: DESC } }
          limit: 1000
        ) {
          edges {
            node {
              frontmatter {
                  date
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
  ) as any


  let totalBlogs = result.data.allMarkdownRemark.edges.length
  const pageSize = 10

  const blogListTemplate = path.resolve("src/templates/post-list.tsx")

  for (let i = 0; i < Math.ceil(totalBlogs / pageSize); i++) {
    let url = ""
    if (i > 0) {
      url = "/" + i.toString()
    }

    const path = type + url

    createPage({
      path,
      component: blogListTemplate,
      context: {
        type: type,
        limit: pageSize + 1,
        skip: i * pageSize,
        pagePath: "/" + path
      }, // additional data can be passed via context
    })
  }
}


async function createTagPages(actions:actionsType, graphql:graphQueryType, reporter: any) {
  const result = await graphql(`{
    allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "blog" } } } ) 
    {
      group(field: frontmatter___tags) {
        tag: fieldValue,
        totalCount
      }
    }
  }`) as any;
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const tagListTemplate = path.resolve(`src/templates/tag-list.tsx`)
  const tagList = result.data.allMarkdownRemark.group

  tagList.forEach((tagData : any) => {
    let tagUrl = tagToUrl(tagData.tag)
    const tagName = tagData.tag
    const tagCount = tagData.totalCount
    const pageSize = 10;


    for (let i = 0; i < Math.ceil(tagData.totalCount / 10); i++) {

      const contextArgs ={
          tag: tagName,
          type: "blog",
          limit: pageSize + 1,
          skip: i * pageSize,
        } // additional data can be passed via context


      if (i == 0)
      {
        const args = {
          path: tagUrl,
          component: tagListTemplate,
          context: {
            ...contextArgs,
            pagePath: tagUrl
          }
        }

        actions.createPage(args)
      }

      actions.createPage({
        path: tagUrl  + "/" + i,
        component: tagListTemplate,
        context: {
          ...contextArgs,
          pagePath: tagUrl + "/" + i
        }
      })
    }
  })
}


export const createPages : GatsbyNode["createPages"] = async ({ actions, graphql, reporter }) => {
  await createBlogArticles(actions, graphql, reporter)
  await createPaginatedForType( actions, graphql, "blog")
  await createPaginatedForType(actions, graphql, "projects")
  await createTagPages(actions, graphql, reporter)
}
