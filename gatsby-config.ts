import { GatsbyConfig } from "gatsby"

const config : GatsbyConfig = {
  siteMetadata: {
    title: `Honlsoft`,
    description: `A personal and software development blog.`,
    author: `@gatsbyjs`,
    image: 'https://www.honlsoft.com/img/honlsoft-thumbnail.jpg'
  },
  plugins: [
    'gatsby-plugin-postcss',
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/projects`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Honlsoft`,
        short_name: `Honlsoft`,
        start_url: `/`,
        background_color: `#005eb8`,
        theme_color: `#005eb8`,
        display: `minimal-ui`,
        icon: `src/images/honlsoft.svg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          'Oswald',
          'Montserrat',
          'Lato'
        ],
        display: "block"
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              linkImagesToOriginal: false,
              maxWidth: 1000,
              quality: 80,
              withWebp: true,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`
          },
          {
            resolve: `gatsby-remark-mermaid`
          },
          {
            resolve: `gatsby-remark-vscode`,
            options: {
              theme: "Light+ (default light)", // Or install your favorite theme from GitHub
            },
          },
          {
            resolve: `gatsby-remark-embedder`,
          },
        ],
      },
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}


export default config
