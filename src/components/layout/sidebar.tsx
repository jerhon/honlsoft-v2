import clsx from "clsx"
import React, { ReactNode } from "react"
import { Link } from "gatsby"
import { GoBook, GoHome, GoLocation, GoQuestion } from "react-icons/go"
import { IoFitnessOutline } from "react-icons/io5"

interface SidebarProps {
  visible: boolean;
  onClose?: () => void
}

interface LinkProps {
  title: string,
  icon: ReactNode,
  href: string
}

function SidebarLink({ title, icon, href }: LinkProps)
{
  return <Link to={href} className="flex text-menu hover:bg-highlight items-center text-xl hover:no-underline p-2 px-6">
    <div className="pr-4 text-slate-600">
      {icon}
    </div>
    <div className="pr-4">
      {title}
    </div>
  </Link>
}

function SidebarLinks() {
  return <div className="flex-col py-4">
    <SidebarLink title="Home" icon={<GoHome />} href="/" />
    <SidebarLink title="Blog" icon={<GoBook />} href="/blog" />
    <SidebarLink title="Projects" icon={<GoBook />} href="/projects" />
    <SidebarLink title="Fitness" icon={<IoFitnessOutline />} href="/fitness" />
    <SidebarLink title="Links" icon={<GoLocation />} href="/links" />

    <SidebarLink title="About Me" icon={<GoQuestion />} href="/about" />

  </div>
}

export function Sidebar({ visible, onClose } : SidebarProps)
{
  return <>
    <div hidden={!visible} onClick={onClose} className={clsx("fixed w-full h-full top-0 left-0 opacity-0 bg-slate-500 blur-lg transition-opacity duration-300", visible && "opacity-40")} />
    <div onClick={onClose} className={clsx("fixed top-16 left-0 bottom-0 max-w-screen-laptop w-fit bg-white transition-transform duration-300", !visible && "-translate-x-full")} >
      <SidebarLinks />
    </div>
  </>
}
