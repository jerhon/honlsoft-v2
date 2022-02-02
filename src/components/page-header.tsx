import React from "react"
import Breadcrumb, { BreadcrumbInfo } from "./breadcrumb"
import { Container } from "./container"

export interface Props {
  title: string
  breadcrumbs: BreadcrumbInfo[] | undefined
}

function PageHeader({ title, breadcrumbs }: Props) {

  return (
    <div className="bg-blue-800 text-white mb-4 pb-4">
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
