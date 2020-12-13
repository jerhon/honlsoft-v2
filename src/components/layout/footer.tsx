import React from "react"
import { Container, makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  footer: {
    backgroundColor: '#eee',
    padding: '16px 0',
    marginTop: '16px'
  }
})

function Footer() {
  const styles = useStyles();

  return (
    <footer className={styles.footer}>
      <Container>
        © {new Date().getFullYear()} Jeremy Honl, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>. Images are from{" "}
        <a href="https://www.unsplash.com">Unsplash</a> by{" "}
        <a href="https://unsplash.com/@conorsexton?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
          Conor Sexton
        </a>{" "}
      </Container>
    </footer>
  )
}

export default Footer
