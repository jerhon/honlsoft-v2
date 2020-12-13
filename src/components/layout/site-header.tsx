import React from "react"
import { AiFillGithub, AiFillLinkedin } from "react-icons/all"
import { AppBar, createStyles, IconButton, makeStyles, Toolbar, Typography } from "@material-ui/core"
import { Link } from "gatsby"

const useStyles = makeStyles((theme) => createStyles({
  title: {
    flexGrow: 1,
    fontFamily: 'Oswald',
    fontWeight: 'bold',
    color: theme.palette.primary.contrastText,
    '& a': {
      textDecoration: 'none'
    },
    '& a:visited': {
      color: theme.palette.primary.contrastText
    }
  },
  icon: {
    color: theme.palette.primary.contrastText
  },
  appBar: {
    backgroundColor: theme.palette.primary.dark
  }
}));

const SiteHeader = () => {
  const styles = useStyles();

  return (
    <AppBar position={"static"} elevation={3} className={styles.appBar}  >
      <Toolbar>

          <Typography variant="h3" className={styles.title}>
            <Link to="/">
            HONLSOFT
            </Link>
          </Typography>
        <IconButton href="https://github.com/jerhon" className={styles.icon}>
          <AiFillGithub size={40} />
        </IconButton>
        <IconButton href="https://www.linkedin.com/in/jhonl/" className={styles.icon}>
          <AiFillLinkedin size={40} />
        </IconButton>
      </Toolbar>
    </AppBar>)
}

export default SiteHeader
