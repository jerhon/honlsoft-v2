import { Link } from "gatsby"
import React from "react"
import styles from "./site-header.module.css"

export interface Props {
  siteName: string;
}

const SiteHeader = ({ siteName }: Props) => {
  
  return (<header className={styles.header}>
    <div className={styles.headerLeft}>
      <h1 style={{ margin: 0 }}>
        <Link to="/" className={styles.title}>
          {siteName.toUpperCase()}
        </Link>
      </h1>
    </div>
    <div className={styles.headerRight}>
      <a href="https://github.com/jerhon" className={styles.link}>
        <img src="/img/github.svg"></img>
      </a>
      <a href="https://www.linkedin.com/in/jhonl/" className={styles.link}>
        <img src="/img/linkedin.svg"></img>
      </a>
    </div>
  </header>)
};

export default SiteHeader;