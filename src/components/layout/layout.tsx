import React, { useCallback, useState } from "react"
import Footer from "./footer"
import AppBar from "./app-bar"
import { Sidebar } from "./sidebar"


// contains all the tailwind styles
import "../../shared.css";



function Layout({ children, isDocked }: { children: React.ReactNode, isDocked: boolean }) {

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarVisible((vis) => !vis);
  }, [setSidebarVisible]);
  const closeSidebar = useCallback(() => {
    setSidebarVisible(false);
  }, [setSidebarVisible])

  return <div className="flex flex-col p-0 m-0 font-sans min-h-screen">
        <AppBar onSidebarToggle={toggleSidebar} isDocked={isDocked} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Sidebar visible={sidebarVisible} onClose={closeSidebar} />
  </div>
}

export default Layout
