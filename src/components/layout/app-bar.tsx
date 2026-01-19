import { FiMenu } from "react-icons/fi"
import { AiFillGithub, AiFillLinkedin, AiFillTwitterCircle } from "react-icons/ai"
import React from "react"
import clsx from "clsx"

interface AppBarProps {
  isDocked: boolean;
  onSidebarToggle: () => void
}

export default function AppBar({ onSidebarToggle, isDocked } : AppBarProps) {

  let baseStyles = "text-3xl text-white fixed top-0 left-0 right-0 h-16 z-30 items-center shadow-md flex transition-[padding]"
  let dockedStyles = "bg-blue-900 p-4 text-4xl"

  return <>
    <nav className={clsx(baseStyles, isDocked && dockedStyles)}>
      <button className="px-4 cursor-pointer" onClick={onSidebarToggle} ><FiMenu /></button>
      <div className="font-logo font-bold text-white cursor-default">HONLSOFT</div>
      <div className="flex-grow" />
      <div className="flex">
        <a href="https://www.twitter.com/honlsoft" className="p-1 text-white"><AiFillTwitterCircle /></a>
        <a href="https://github.com/jerhon" className="p-1 text-white"><AiFillGithub /></a>
        <a href="https://www.linkedin.com/in/jhonl/" className="p-1 text-white"><AiFillLinkedin /></a>
      </div>
    </nav>
    {/* This acts as a spacer for the fixed header. */}
  </>
}
