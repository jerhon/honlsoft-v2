import React from "react"
import Breadcrumb, { BreadcrumbInfo } from "./breadcrumb"

export interface Props {
  title: string
  breadcrumbs: BreadcrumbInfo[] | undefined
}

function PageHeader({ title, breadcrumbs }: Props) {
  return (
    <div className="blue-back">
      <div className="page-width">
        <h1 style={{ margin: "50px 0px" }}>{title}</h1>
        {breadcrumbs ? (
          <div>
            <Breadcrumb links={breadcrumbs} />{" "}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default PageHeader
