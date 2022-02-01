import React from "react";
import books from "./images/books.jpg"
import code from "./images/code.jpg"
import about from "./images/about.jpg"
import { Link } from "gatsby"

interface NavigationCardProps {
  title: string,
  imageUrl: string,
  description: string
  linkUrl: string
}

function NavigationCard(card: NavigationCardProps) {
  return <Link className="border-1 rounded-xl shadow-lg flex flex-col overflow-clip hover:scale-105 transition-transform cursor-pointer max-w-[450px] mx-auto my-8 text-black hover:no-underline" to={card.linkUrl}>
    <div className="text-white bg-red-600  p-2">
      <h2 className="p-2 m-0">{card.title}</h2>
    </div>
    <div className="overflow-clip">
      <img src={card.imageUrl} className="w-full" alt="bookcase picture" />
    </div>
    <div className="p-4 border-b-1 flex-grow">
      {card.description}
    </div>
    <div className="p-4">
      <a href="/blog">Learn more...</a>
    </div>
  </Link>
}


export function NavigationSection() {

  return <nav className="desktop:grid desktop:-mt-[300px] grid-cols-3 gap-8 py-4 my-8 overflow-clip p-8">
      <NavigationCard title="Blog" linkUrl="/blog" imageUrl={books} description="Take a look at what I've been learning about lately.  I blog about tehcnical topics that intrigue me." />
      <NavigationCard title="Projects" linkUrl="/projects" imageUrl={code} description="Learn about personal projects I have worked on in the past. These are small projects I'm working on 'just for fun' outside of my day job." />
      <NavigationCard title="About Me" linkUrl="/about" imageUrl={about} description="Learn all about how I started coding, and what I'm doing now." />
    </nav>

}

