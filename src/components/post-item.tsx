import { Link } from "gatsby"
import React from "react"
import { FiCalendar, FiClock } from "react-icons/fi"
import { tagToUrl } from "../tags"


export interface PostItemProps {
  title: string
  excerpt: string
  readTime: string
  date: string
  url: string
  tags?: string[]
}

export function PostItem(article: PostItemProps) {
  return (

      <div className="my-2 mb-6">
        <Link to={article.url} className="w-full">
          <div className="font-bold text-red-600 w-full">
            {article.title}
          </div>
        </Link>

        <p className="my-2">{article.excerpt}</p>

        <div className="text-slate-600 text-sm flex space-x-2 my-2 items-center">
          <div><FiCalendar /></div>
          <div>{article.date}</div>
          <div>|</div>
          <div><FiClock /></div>
          <div>approximately {article.readTime} minutes to read</div>
        </div>

        <div className="space-x-0.5 my-2">
          {article.tags?.sort((a, b) => a.localeCompare(b)).map((t) => <Tag name={t} url={tagToUrl(t)} /> )}
        </div>

      </div>)
}


export function Tag(props: {name: string, url: string}) {
  return <Link to={props.url} className="bg-blue-700 hover:bg-blue-600 text-xs text-white rounded-lg py-1 px-2">
    {props.name}
  </Link>
}
