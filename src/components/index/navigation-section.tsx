import React from "react";
import books from "./images/books.jpg"
import code from "./images/code.jpg"
import about from "./images/about.jpg"
import { Link } from "gatsby"
import { NextPageButton } from "../next-page-button"
import { FiChevronsRight } from "react-icons/fi"
import { ScrollReveal } from "../scroll-reveal"

interface NavigationCardProps {
  title: string,
  imageUrl: string,
  description: string
  linkUrl: string
}

function NavigationCard(card: NavigationCardProps) {
  return <Link className="group border rounded-xl shadow-lg hover:shadow-2xl border-gray-200 flex flex-col overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer max-w-[450px] mx-auto my-8 text-black hover:no-underline bg-white h-full" to={card.linkUrl}>
    <div className="overflow-hidden h-[250px] relative flex-shrink-0">
      <img src={card.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={card.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-2 flex flex-col flex-grow min-h-0">
      <div className="p-4 m-0 text-lg font-bold group-hover:text-red-600 transition-colors flex-shrink-0">{card.title}</div>
      <div className="p-4 border-b flex-grow text-slate-700 min-h-0">
        {card.description}
      </div>
      <div className="p-4 flex-shrink-0">
        <div className="text-secondary flex items-center group-hover:translate-x-2 transition-transform">
          <div className="flex-grow">
            Learn more...
          </div>
          <div>
            <FiChevronsRight className="group-hover:animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </Link>
}


export function NavigationSection() {

  return <div className="min-h-screen flex flex-col justify-center pt-16">
    <div className="flex-grow flex flex-col  ">
      <nav className="desktop:grid desktop:grid-cols-3 desktop:grid-rows-1 gap-8 my-auto px-8">
        <ScrollReveal animation="fade-up" delay={0} className="h-full">
          <NavigationCard title="Blog" linkUrl="/blog" imageUrl={books} description="Take a look at what I've been learning about lately.  I blog about technical topics that intrigue me." />
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={150} className="h-full">
          <NavigationCard title="Projects" linkUrl="/projects" imageUrl={code} description="Learn about personal projects I have worked on in the past. These are small projects I'm working on 'just for fun' outside of my day job." />
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={300} className="h-full">
          <NavigationCard title="About Me" linkUrl="/about" imageUrl={about} description="Learn all about how I started coding, and what I'm doing now." />
        </ScrollReveal>
      </nav>
    </div>
    <div>
      <NextPageButton color="red" />
    </div>
  </div>

}

