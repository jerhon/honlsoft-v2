import React from "react"
import Breadcrumb, { BreadcrumbInfo } from "../navigation/breadcrumb"
import { Container } from "../ui/container"

export interface Props {
  title: string
  breadcrumbs: BreadcrumbInfo[] | undefined
}

function PageHeader({ title, breadcrumbs }: Props) {

  return (
    <div className="bg-blue-800 text-white mb-4 pb-4 pt-12">
      <Container>
        <h1 style={{ padding: "50px 0px", margin: 0, fontSize: '2.25rem', fontWeight: 700 }}>{title}</h1>

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
