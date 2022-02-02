import React, { ReactNode } from "react"
import { Container } from "../container"

export interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section(props: SectionProps) {

  return <div className="flex-col mt-8">
    <Container>
      <h2 className="py-4 text-3xl">{props.title}</h2>
      <div>
        {props.children}
      </div>
    </Container>
  </div>
}
