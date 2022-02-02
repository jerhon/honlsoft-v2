import React from "react"
import { Link } from "gatsby"

export interface BreadcrumbInfo {
  title: string
  url: string
}
export interface BreadcrumbProps {
  links: BreadcrumbInfo[]
}


function Breadcrumbs({ links }: BreadcrumbProps) {
  let ret: JSX.Element[] = []
  if (links.length > 0) {
    let linksArray = links.map(l => (
      <Link key={l.title} to={l.url} className="text-white no-underline">
        {l.title}
      </Link>
    ))
    for (let link of linksArray) {
      ret.push(link)
      ret.push(<span className="px-1">/</span>)
    }
  }
  if (ret.length > 0) {
    ret.pop();
  }
  return <nav className="font-title">{ret}</nav>
}

export default Breadcrumbs
