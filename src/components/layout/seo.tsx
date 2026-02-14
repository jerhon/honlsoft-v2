/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
// @ts-ignore
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

export interface SeoProps {
  description?: string,
  lang?: string,
  meta?: Meta,
  title?: string,
  image?:string
}

interface Meta {
  name?: string;
  property?: string;
  content?: any;
}

function SEO({ description, lang, meta, title, image }: SeoProps) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            image
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  let metaArray : Meta[] = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: title ?? site.siteMetadata.title,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: "image",
      property: `og:image`,
      content: image ?? site.siteMetadata.image
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: site.siteMetadata.author,
    },
    {
      name: `twitter:title`,
      content: title ?? site.siteMetadata.title,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
  ];

  if (meta)
  {
    metaArray = metaArray.concat(meta);
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title === "Home" ? null : title}
      defaultTitle={site.siteMetadata.title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={metaArray}
    />
  )
}


export default SEO
