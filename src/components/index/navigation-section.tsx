import React from "react";
import books from "./images/books.jpg"
import code from "./images/code.jpg"
import about from "./images/about.jpg"
import { Link } from "gatsby"
import { NextPageButton } from "../next-page-button"
import { FiChevronsRight } from "react-icons/all"

interface NavigationCardProps {
  title: string,
  imageUrl: string,
  description: string
  linkUrl: string
}

function NavigationCard(card: NavigationCardProps) {
  return <Link className="border-1 rounded-xl shadow border flex flex-col overflow-clip hover:scale-105 transition-transform cursor-pointer max-w-[450px] mx-auto my-8 text-black hover:no-underline bg-white " to={card.linkUrl}>
    <div className="overflow-clip h-[250px]">
      <img src={card.imageUrl} className="w-full" alt="picture" />
    </div>
    <div className="p-2">
      <div className="p-4 m-0 text-lg">{card.title}</div>
      <div className="p-4 border-b-1 flex-grow text-slate-700">
        {card.description}
      </div>
      <div className="p-4">
        <div className="text-secondary flex">
          <div className="flex-grow">
            Learn more...
          </div>
          <div>
            <FiChevronsRight />
          </div>
        </div>
      </div>
    </div>
  </Link>
}


export function NavigationSection() {

  return <div className="min-h-screen flex flex-col justify-center pt-16">
    <div className="flex-grow flex flex-col  ">
      <nav className="desktop:grid desktop:auto-rows-max grid-cols-3 gap-8 overflow-clip my-auto px-8">
        <NavigationCard title="Blog" linkUrl="/blog" imageUrl={books} description="Take a look at what I've been learning about lately.  I blog about technical topics that intrigue me." />
        <NavigationCard title="Projects" linkUrl="/projects" imageUrl={code} description="Learn about personal projects I have worked on in the past. These are small projects I'm working on 'just for fun' outside of my day job." />
        <NavigationCard title="About Me" linkUrl="/about" imageUrl={about} description="Learn all about how I started coding, and what I'm doing now." />
      </nav>
    </div>
    <div>
      <NextPageButton color="red" />
    </div>
  </div>

}

