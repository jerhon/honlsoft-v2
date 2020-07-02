import React from "react"
import SiteHeader from "./site-header"
import "./layout.css"
import "./styles.css"
import Footer from "./footer"
import styles from "./layout.module.css"

export const Layout = ({ children }) => {

  return (
    <div className={styles.container} style={{minHeight: '100vh'}}>
      <SiteHeader siteName="Honlsoft" />
      <main className={styles.main} style={{height: '100%'}}>{children}</main>
      <Footer />
    </div>
  )
}

