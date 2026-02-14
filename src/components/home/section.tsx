import React, { ReactNode } from "react"
import { Container } from "../ui/container"
import { ScrollReveal } from "../ui/scroll-reveal"

export interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section(props: SectionProps) {

  return <div className="flex-col mt-16 mx-4">
    <Container>
      <ScrollReveal animation="fade-up">
        <h2 className="py-4 text-3xl font-bold">{props.title}</h2>
      </ScrollReveal>
      <div>
        {props.children}
      </div>
    </Container>
  </div>
}
