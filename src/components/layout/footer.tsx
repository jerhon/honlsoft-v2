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
        <a href="https://www.unsplash.com">Unsplash</a>
      </Container>
    </footer>
  )
}

export default Footer
