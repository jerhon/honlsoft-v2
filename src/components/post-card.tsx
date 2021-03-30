import { Link } from "gatsby"
import React from "react"
import { createStyles, makeStyles } from "@material-ui/core"

let useStyles = makeStyles((theme) => createStyles({
  tiny: {
    fontSize: '0.8rem'
  }
}));

export interface PostCardProps {
  url: string,
  title: string,
  excerpt: string,
  timeToRead: string,
  date: string
}

export function PostCard(a: PostCardProps) {
  const styles = useStyles();

  return (<div>
    <Link to={a.url}>
      <h3>{a.title}</h3>
    </Link>
    <p>{a.excerpt}</p>
    <div className={styles.tiny}>
      {a.date} | approximately {a.timeToRead} minutes to read
    </div>
  </div>)
}
