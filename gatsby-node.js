/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path")

async function createBlogArticles(actions, graphql, reporter) {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/post.tsx`)
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
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
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    let url = ""
    if (node.frontmatter.page) {
      url = node.frontmatter.page
    } else {
      url = node.frontmatter.type + "/" + node.parent.name
    }

    createPage({
      path: url,
      component: blogPostTemplate,
      context: {
        id: node.id,
        project: node.frontmatter.project ?? "no-project",
      }, // additional data can be passed via context
    })
  })
}

async function createTypePagination(actions, graphql, type) {
  let { createPage } = actions
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {frontmatter: {type: {eq: "` +
      type +
      `"}}}
          sort: { order: DESC, fields: [frontmatter___date] }
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
  )

  let totalBlogs = result.data.allMarkdownRemark.edges.length
  const pageSize = 10

  const blogListTemplate = path.resolve("src/templates/post-list.tsx")

  for (let i = 0; i < Math.ceil(totalBlogs / pageSize); i++) {
    let url = ""
    if (i > 0) {
      url = "/" + i.toString()
    }

    createPage({
      path: type + url,
      component: blogListTemplate,
      context: {
        type: type,
        limit: pageSize + 1,
        skip: i * pageSize,
      }, // additional data can be passed via context
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  await createBlogArticles(actions, graphql, reporter)
  await createTypePagination(actions, graphql, "blog")
  await createTypePagination(actions, graphql, "projects")
}
