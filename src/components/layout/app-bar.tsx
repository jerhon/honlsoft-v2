import { FiMenu } from "react-icons/fi"
import { AiFillGithub, AiFillLinkedin, AiFillTwitterCircle } from "react-icons/ai"
import React from "react"

interface AppBarProps {
  onSidebarToggle: () => void
}

export default function AppBar({ onSidebarToggle } : AppBarProps) {
  return <>
    <nav className="flex text-4xl p-2 bg-blue-900 text-white fixed top-0 left-0 right-0 h-16 z-30 items-center shadow-md select-none">
      <button className="bg-transparent px-4" onClick={onSidebarToggle} ><FiMenu /></button>
      <div className="font-bold text-white font-title cursor-default">HONLSOFT</div>
      <div className="flex-grow" />
      <div className="flex">
        <a href="https://www.twitter.com/honlsoft" className="p-1 text-white"><AiFillTwitterCircle /></a>
        <a href="https://github.com/jerhon" className="p-1 text-white"><AiFillGithub /></a>
        <a href="https://www.linkedin.com/in/jhonl/" className="p-1 text-white"><AiFillLinkedin /></a>
      </div>
    </nav>
    {/* This acts as a spacer for the fixed header. */}
    <div className="h-16" />
  </>
}
