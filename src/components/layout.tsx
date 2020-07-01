/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import SiteHeader from "./site-header"
import "./layout.css"
import Footer from "./footer"

export const Layout = ({ children }) => {

  return (
    <>
      <SiteHeader siteName="Honlsoft" />
      <main>{children}</main>
      <Footer />
    </>
  )
}

