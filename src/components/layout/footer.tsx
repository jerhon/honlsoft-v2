import React from "react"
import { Container } from "../container";

function Footer() {

  return <footer className="bg-slate-100 py-2 text-sm mt-4">
      <Container>
        © {new Date().getFullYear()} - Built and designed by Jeremy Honl with <a href="https://www.gatsbyjs.org">Gatsby</a>. Images are from <a href="https://www.unsplash.com">Unsplash</a>
      </Container>
    </footer>
}

export default Footer
