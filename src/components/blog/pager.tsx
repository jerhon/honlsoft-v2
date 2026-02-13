import React from "react"
import * as styles from "./pager.module.css"
import { BiChevronLeft, BiChevronRight } from "react-icons/bi"
import { Link } from "gatsby"

export interface PagerProps {
  backUrl?: string
  forwardUrl?: string
}

function Pager({ backUrl, forwardUrl }: PagerProps) {
  let left = backUrl &&
    <Link to={backUrl}>
      <BiChevronLeft /> Previous
    </Link>

  let right = forwardUrl &&
    <Link to={forwardUrl}>
      Next <BiChevronRight />
    </Link>

  return (
    <div className={styles.pager}>
      {left}
      {right}
    </div>
  )
}

export default Pager
