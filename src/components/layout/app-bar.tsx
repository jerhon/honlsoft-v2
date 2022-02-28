import { FiMenu } from "react-icons/fi"
import { AiFillGithub, AiFillLinkedin, AiFillTwitterCircle } from "react-icons/ai"
import React from "react"
import * as styles from "./app-bar.module.css";
import clsx from "clsx"

interface AppBarProps {
  isDocked: boolean;
  onSidebarToggle: () => void
}

export default function AppBar({ onSidebarToggle, isDocked } : AppBarProps) {

  return <>
    <nav className={clsx(styles.base, isDocked && styles.docked)}>
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
  </>
}
