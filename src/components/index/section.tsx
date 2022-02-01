import React, { ReactNode } from "react"
import { Container } from "../container"

export interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section(props: SectionProps) {

  return <div className="flex-col">
    <Container>
      <h2 className="py-4">{props.title}</h2>
      <div>
        {props.children}
      </div>
    </Container>
  </div>
}
