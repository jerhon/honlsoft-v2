import React, { useRef } from "react"
import * as styles from "./title-section.module.css";
import { useInView } from "../in-view-modifier"

export function TitleSection() {

  let ref = useRef<HTMLDivElement>(null);
  useInView(ref, { classesToAdd: ["opacity-100"], classesToRemove: ["opacity-0"], sticky: true })

  return <div className={styles.container}>
    <div className="flex-grow m-auto text-3xl bold font-title flex opacity-0 transition-opacity duration-[3s] mx-8" ref={ref}>
      <span className="m-auto justify-center align-center opacity-90">Building software shouldn't feel like climbing a mountain.</span>
    </div>
    <div className="flex-grow" />
  </div>
}

