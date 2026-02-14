import { Link, navigate } from "gatsby"
import React from "react"
import { FiArrowRightCircle } from "react-icons/fi"
import { FiCalendar, FiClock } from "react-icons/fi"
import { tagToUrl } from "../../tags"
import { ScrollReveal } from "../ui/scroll-reveal"


export interface PostItemProps {
  title: string
  excerpt: string
  readTime: string
  date: string
  url: string
  tags?: string[]
}

export function PostItem(article: PostItemProps) {
  const goToPost = () => navigate(article.url)

  return (
    <ScrollReveal animation="fade-up">
      <div
        className="group relative my-2 mb-6 p-4 pr-24 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
        onClick={goToPost}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            goToPost()
          }
        }}
        tabIndex={0}
        role="link"
        aria-label={`Open post ${article.title}`}
      >
        <div className="font-bold text-red-600 w-full hover:text-red-700 text-lg">
          {article.title}
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          <FiArrowRightCircle size="60px" />
        </div>

        <p className="my-2 text-slate-700">{article.excerpt}</p>

        <div className="text-slate-600 text-sm flex space-x-2 my-2 items-center">
          <div><FiCalendar /></div>
          <div>{article.date}</div>
          <div>|</div>
          <div><FiClock /></div>
          <div>approximately {article.readTime} minutes to read</div>
        </div>

        <div className="space-x-0.5 my-2">
          {article.tags?.sort((a, b) => a.localeCompare(b))?.map((t) => <Tag key={t} name={t} url={tagToUrl(t)} /> )}
        </div>

      </div>
    </ScrollReveal>
  )
}


export function Tag(props: {name: string, url: string}) {
  return <Link to={props.url} className="bg-blue-700 hover:bg-blue-600 text-xs text-white rounded-lg py-1 px-2">
    {props.name}
  </Link>
}
