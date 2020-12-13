import { Link } from "gatsby"
import React from "react"
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia, createStyles, Divider,
  makeStyles
} from "@material-ui/core"

export enum Orientation {
  Left,
  Right
}

interface LinkCardProps {
  title: string
  description: string
  icon: JSX.Element
  url: string
}

const useStyles = makeStyles((theme) => createStyles({
  title: {
    textAlign: 'center',
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText
  },
  text: {
    wordWrap: 'break-word'
  },
  card: {
    padding: '8px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  icon: {
    width: '100px',
    height: '100px',
    margin: '8px auto'
  },
  content: {
    flexGrow: 1
  }
}));

function LinkCard({ title, description, icon, url }: LinkCardProps) {
  const styles = useStyles();

  return (
    <Card elevation={1} variant="outlined" className={styles.card}>
      <CardHeader title={title} className={styles.title} />
      <Divider />
      <CardMedia>
        <div className={styles.icon}>{icon}</div>
      </CardMedia>
      <CardContent className={styles.content}>
        <div >
          {description}
        </div>
      </CardContent>

      <Divider />
      <CardActions>
        <Button component={Link} to={url} size="medium" color={"secondary"}>Learn more...</Button>
      </CardActions>
    </Card>
  )
}

export default LinkCard
