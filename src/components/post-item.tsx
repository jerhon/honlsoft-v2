import { Link } from "gatsby"
import React from "react"
import { FiCalendar, FiClock } from "react-icons/fi"


export interface PostItemProps {
  title: string
  excerpt: string
  readTime: string
  date: string
  url: string
}

export function PostItem(article: PostItemProps) {
  return (

      <div className="py-2 mb-6">
        <Link to={article.url} className="w-full">
        <div className="font-bold text-red-600 w-full">
          {article.title}
        </div>
        </Link>
        <p className="py-4">{article.excerpt}</p>
        <div className="text-slate-600 text-sm flex space-x-2">
          <div><FiCalendar /></div>
          <div>{article.date}</div>
          <div>|</div>
          <div><FiClock /></div>
          <div>approximately {article.readTime} minutes to read</div>
        </div>
      </div>)
}
