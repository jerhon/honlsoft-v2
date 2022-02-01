import { Link } from "gatsby"
import React from "react"


export interface PostItemProps {
  title: string
  excerpt: string
  readTime: string
  date: string
  url: string
}

export function PostItem(article: PostItemProps) {
  return (
    <div className="py-2">
      <Link to={article.url}>
        <h3>{article.title}</h3>
      </Link>
      <p className="py-2">{article.excerpt}</p>
      <div className="opacity-80 text-sm">
        {article.date} | approximately {article.readTime} minutes to read
      </div>
    </div>)
}
