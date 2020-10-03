import React from "react"
import styles from "./title-picture.module.css"
import { InViewModifier } from "./InViewModifier"

// TODO: Parameterize Picture URL, Height

export interface Props {
  tagLine: string
  className?: string
}

function TitlePicture({ tagLine, className }) {
  const classes = className ? styles.container + " " + className : styles.container;
  return (
    <div className={classes}>
      <InViewModifier
        className={styles.tagLineContainer}
        inViewClassName={styles.tagLineVisible}
        sticky={true}
      >
        <h3 className={styles.tagLine}>{tagLine}</h3>
      </InViewModifier>
    </div>
  )
}

export default TitlePicture
