import React from "react"
import { Container, makeStyles } from "@material-ui/core"
import MuiLink from "@material-ui/core/Link"

const useStyles = makeStyles({
  footer: {
    backgroundColor: '#eee',
    padding: '16px 0',
    marginTop: '16px'
  }
})

function Footer() {
  const styles = useStyles();

  return <footer className={styles.footer}>
      <Container>
        © {new Date().getFullYear()} - Built and designed by Jeremy Honl with <MuiLink href="https://www.gatsbyjs.org">Gatsby</MuiLink>. Images are from <MuiLink href="https://www.unsplash.com">Unsplash</MuiLink>
      </Container>
    </footer>
}

export default Footer
