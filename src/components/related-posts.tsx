import React from "react"
import { Link } from "gatsby"
import MuiLink from "@material-ui/core/Link"

export interface props {
  links: {
    title: string
    url: string
  }[]
}

function RelatedPosts(props: props) {
  if (props.links.length) {
    let links = props.links.map(n => (
      <li>
        <MuiLink component={Link} to={n.url}>{n.title}</MuiLink>
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
