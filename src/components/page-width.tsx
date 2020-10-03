import React from "react"

export interface PageWidthProperties {
  children: JSX.Element | string | (string | JSX.Element)[]
}

export function PageWidth({ children }: PageWidthProperties) {
  return <div className="page-width">{children}</div>
}
