import React from "react"

export interface BlueHeadingProperties {
  children: string | JSX.Element | (string | JSX.Element)[]
}

export function BlueSection({ children }: BlueHeadingProperties) {
  return (
    <div className="blue-back">
      <div className="page-width">{children}</div>
    </div>
  )
}
