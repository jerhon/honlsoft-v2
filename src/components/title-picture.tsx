import React from "react"
import * as styles from "./title-picture.module.css"
import { InViewModifier } from "./in-view-modifier"
import clsx from "clsx"

// TODO: Parameterize Picture URL, Height

export interface TitlePictureProps {
  id?: string;
  tagLine: string
  className?: string
  children?: JSX.Element[] | JSX.Element;
}

function TitlePicture({ id, tagLine, className, children }: TitlePictureProps) {

  return (
    <div id={id} className={clsx(styles.container, className)}>
      <InViewModifier
        className={styles.tagLineContainer}
        inViewClassName={styles.tagLineVisible}
        sticky={true}>
        <h1 className={styles.tagLine}>{tagLine}</h1>
      </InViewModifier>
      <div className={styles.children}>
      {children}
      </div>
    </div>
  )
}

export default TitlePicture
