import React from "react"
import SiteHeader from "./site-header"
import Footer from "./footer"
import { createMuiTheme, CssBaseline, makeStyles, MuiThemeProvider } from "@material-ui/core"
import { blue, red } from "@material-ui/core/colors"


const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[900]
    },
    secondary: {
      main: red[800]
    }
  },
  typography: {
    fontSize: 16
  },
  overrides: {
    MuiLink: {
      root: {
        color: red[900]
      }
    }
  }
})

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100vh'
  },
  main: {
    flex: '1 0 auto',
  }
});

function Layout({ children }) {

  const styles = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.container}>
        <SiteHeader />
        <main className={styles.main} style={{ height: "100%" }}>
          {children}
        </main>
        <Footer />
      </div>
    </MuiThemeProvider>
  )
}

export default Layout
