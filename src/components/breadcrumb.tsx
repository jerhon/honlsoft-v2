import React from "react"
import { Link } from "gatsby"
import MuiLink from "@material-ui/core/Link";
import { Breadcrumbs, createStyles, makeStyles } from "@material-ui/core"

export interface BreadcrumbInfo {
  title: string
  url: string
}
export interface BreadcrumbProps {
  links: BreadcrumbInfo[]
}

const useStyles = makeStyles((theme) => createStyles({
  root: {
    color: theme.palette.primary.contrastText
  }
}))

function Breadcrumb({ links }: BreadcrumbProps) {
  let styles = useStyles();
  let ret: JSX.Element[] = []
  if (links.length > 0) {
    let linksArray = links.map(l => (
      <MuiLink key={l.title} to={l.url} component={Link}>
        {l.title}
      </MuiLink>
    ))
    for (let link of linksArray) {
      ret.push(link)
    }
  }
  return <Breadcrumbs className={styles.root}>{ret}</Breadcrumbs>
}

export default Breadcrumb
