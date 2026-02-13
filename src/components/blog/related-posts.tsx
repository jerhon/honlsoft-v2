import React from "react"
import { Link } from "gatsby"

export interface RelatedPostProps {
  links: {
    title: string
    url: string
  }[]
}

function RelatedPosts(props: RelatedPostProps) {
  if (props.links.length) {
    let links = props.links.map(n => (
      <li>
        <Link to={n.url}>{n.title}</Link>
      </li>
    ))

    return (
      <div>
        <h3>Related Posts</h3>
        <ul>{links}</ul>
      </div>
    )
  } else {
    return <></>
  }
}

export default RelatedPosts
