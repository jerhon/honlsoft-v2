import React from "react"
import Breadcrumb, { BreadcrumbInfo } from "./breadcrumb"
import { Container, createStyles, makeStyles } from "@material-ui/core"

export interface Props {
  title: string
  breadcrumbs: BreadcrumbInfo[] | undefined
}

const useStyles = makeStyles((theme) => createStyles({
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    paddingBottom: '8px',

    '& a': {
      color: theme.palette.primary.contrastText,
      textDecoration: 'none',

      '&:hover': {
        textDecoration: 'underline'
      },
      '&:visited': {
        color: theme.palette.primary.contrastText,
      }
    }
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
