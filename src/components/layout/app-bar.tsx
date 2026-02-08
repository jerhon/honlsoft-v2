import { FiMenu } from "react-icons/fi"
import { AiFillGithub, AiFillLinkedin, AiFillTwitterCircle } from "react-icons/ai"
import React from "react"
import clsx from "clsx"

interface AppBarProps {
  isDocked: boolean;
  onSidebarToggle: () => void
}

export default function AppBar({ onSidebarToggle, isDocked } : AppBarProps) {

  let baseStyles = "fixed top-0 left-0 right-0 h-16 z-30 items-center flex transition-all duration-300"
  let dockedStyles = "bg-blue-900/95 backdrop-blur-md shadow-lg px-6"
  let undockedStyles = "bg-transparent px-4"

  return <>
    <nav className={clsx(baseStyles, isDocked ? dockedStyles : undockedStyles)}>
      <button 
        className="p-2 cursor-pointer text-white hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110" 
        onClick={onSidebarToggle}
        aria-label="Toggle menu"
      >
        <FiMenu className="text-2xl" />
      </button>
      <div className="font-logo font-bold text-white cursor-default text-2xl ml-4 tracking-wider">
        HONLSOFT
      </div>
      <div className="flex-grow" />
      <div className="flex gap-2">
        <a 
          href="https://www.twitter.com/honlsoft" 
          className="p-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
          aria-label="Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillTwitterCircle className="text-2xl" />
        </a>
        <a 
          href="https://github.com/jerhon" 
          className="p-2 text-white hover:text-gray-300 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
          aria-label="GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillGithub className="text-2xl" />
        </a>
        <a 
          href="https://www.linkedin.com/in/jhonl/" 
          className="p-2 text-white hover:text-blue-300 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillLinkedin className="text-2xl" />
        </a>
      </div>
    </nav>
    {/* This acts as a spacer for the fixed header. */}
  </>
}
