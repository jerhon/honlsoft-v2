import { Link, navigate } from "gatsby"
import React from "react"

import {
  Button,
  Card,
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
  image: string
  url: string
}

const useStyles = makeStyles(() => createStyles({
  text: {
    wordWrap: 'break-word'
  },
  media: {
    height: "200px"
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 250ms ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      'transform': 'scale(1.075)',

    }
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

function LinkCard({ title, description, image, url }: LinkCardProps) {
  const styles = useStyles();

  return (
    <Card elevation={8} className={styles.card} onClick={() => navigate(url) }>
      <CardHeader title={title} />
      <CardMedia className={styles.media} image={image} title={title} />
      <CardContent className={styles.content}>
          {description}
      </CardContent>
      <Divider />
      <CardActions>
        {/* The button isn't really needed since the whole card links to the page, but I figure this will help gatsby with it's prefetching. */}
        <Button component={Link} to={url} size="medium" color={"secondary"}>Learn more...</Button>
      </CardActions>
    </Card>
  )
}

export default LinkCard
