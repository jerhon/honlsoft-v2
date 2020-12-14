import React, { useState } from "react"
import { AiFillGithub, AiFillLinkedin, FiMenu, GoBook, GoFile, GoQuestion } from "react-icons/all"
import {
  AppBar,
  createStyles, Divider,
  Drawer,
  IconButton, List, ListItem,
  ListItemIcon, ListItemText,
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core"
import { Link } from "gatsby"
import MuiLink from "@material-ui/core/Link"

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
    color: theme.palette.primary.contrastText,
    padding: '12px 4px'
  },
  appBar: {
    backgroundColor: theme.palette.primary.dark
  },
  list: {
    width: '250px'
  },
  drawerTitle: {
    padding: '2px 16px'
  }
}));

const SiteHeader = () => {
  const [isOpen, setOpen] = useState(false);
  const styles = useStyles();

  return (
    <React.Fragment>
      <AppBar position={"static"} elevation={3} className={styles.appBar}  >
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(!isOpen)} >
            <FiMenu />
          </IconButton>
          <Typography variant="h4" className={styles.title}>
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
      </AppBar>
      <Drawer open={isOpen} onClose={() => setOpen(false)}>
        <MuiLink component={Link} to="/"><h3 className={styles.drawerTitle}>HONLSOFT</h3></MuiLink>
        <Divider />
        <List className={styles.list}>
          <ListItem component={Link} to="/blog" button>
            <ListItemIcon><GoBook size={28} /></ListItemIcon>
            <ListItemText>Blog</ListItemText>
          </ListItem>
          <ListItem component={Link} to="/projects" button>
            <ListItemIcon><GoFile size={28} /></ListItemIcon>
            <ListItemText>Projects</ListItemText>
          </ListItem>
          <ListItem component={Link} to="/about" button>
            <ListItemIcon><GoQuestion size={28} /></ListItemIcon>
            <ListItemText>About</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>);
}

export default SiteHeader
