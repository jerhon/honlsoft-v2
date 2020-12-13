import React from "react"
import Breadcrumb, { BreadcrumbInfo } from "./breadcrumb"
import { Container, createStyles, makeStyles } from "@material-ui/core"
import { linkStyles } from "../styles"

export interface Props {
  title: string
  breadcrumbs: BreadcrumbInfo[] | undefined
}

const useStyles = makeStyles((theme) => createStyles({
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    paddingBottom: '8px',
    ...linkStyles(theme.palette.primary.contrastText)
  }
}));

function PageHeader({ title, breadcrumbs }: Props) {

  const styles = useStyles();

  return (
    <div className={styles.header}>
      <Container>
        <h1 style={{ padding: "50px 0px", margin: 0 }}>{title}</h1>

        {breadcrumbs ? (
          <div>
            <Breadcrumb links={breadcrumbs} />{" "}
          </div>
        ) : null}
      </Container>
    </div>
  )
}

export default PageHeader
