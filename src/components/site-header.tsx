import { Link } from "gatsby"
import React from "react"
import headerStyles from "./site-header.module.css"

export class SiteHeader extends React.Component<{siteName: string}> {

  render() {

    let siteName = this.props.siteName.toUpperCase();

    return (<header className={headerStyles.header} >
      <div className={headerStyles.headerLeft}>
        <h1 style={{ margin: 0 }}>
          <Link to="/" className={headerStyles.title}>
            {siteName}
          </Link>
        </h1>
      </div>
      <div className={headerStyles.headerRight}>
        <Link to="https://github.com/jerhon" className={headerStyles.link}>
          <img src="/img/github.svg"></img>
        </Link>
        <Link to="https://www.linkedin.com/in/jhonl/" className={headerStyles.link}>
          <img src="/img/linkedin.svg"></img>
        </Link>
      </div>
    </header>);
  }

}

export default SiteHeader;