import React from "react"
import * as styles from "./pager.module.css"
import { BiChevronLeft, BiChevronRight } from "react-icons/bi"
import MuiLink from "@material-ui/core/Link"
import { Link } from "gatsby"

export interface PagerProps {
  backUrl?: string
  forwardUrl?: string
}

function Pager({ backUrl, forwardUrl }: PagerProps) {
  let left = backUrl &&
    <MuiLink to={backUrl} component={Link}>
      <BiChevronLeft /> Previous
    </MuiLink>

  let right = forwardUrl &&
    <MuiLink to={forwardUrl} component={Link}>
      Next <BiChevronRight />
    </MuiLink>

  return (
    <div className={styles.pager}>
      {left}
      {right}
    </div>
  )
}

export default Pager
