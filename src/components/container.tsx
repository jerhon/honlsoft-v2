import React, { ReactNode } from "react"

export interface ContainerProps {
  children: ReactNode;
}

export function Container(props: ContainerProps) {
  return <div className="desktop:container desktop:mx-auto px-2">
    {props.children}
  </div>
}
