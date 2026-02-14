import React from "react";
import * as styles from "./hero-section.module.css";
import { NextPageButton } from "../navigation/next-page-button"

export function TitleSectionV2() {
  return <div className={styles.background}>
    <div className="flex flex-col h-screen text-white justify-center align-middle items-center min-h-[500px] relative">
      <div className="flex-grow align-middle flex mt-20 z-10">
        <div className="flex flex-col desktop:flex-row max-w-6xl mx-auto px-6">
          <div className="m-auto text-2xl desktop:text-4xl font-bold desktop:border-r-2 desktop:border-white/30 desktop:pr-8 desktop:mr-8 mb-6 desktop:mb-0 text-center desktop:text-right">
            <div className={styles.fadeInUp}>Jeremy's</div>
            <div className={`${styles.fadeInUp} ${styles.delay1}`}>Technology Blog</div>
          </div>
          <div className="text-3xl desktop:text-5xl font-bold m-auto text-center desktop:text-left desktop:pl-8 leading-tight">
            <div className={`${styles.fadeInUp} ${styles.delay2}`}>Let's build software</div>
            <div className={`${styles.fadeInUp} ${styles.delay3}`}>people <span className={styles.highlight}>dream</span> of using.</div>
          </div>
        </div>
      </div>
      <div className={`flex z-10 ${styles.fadeInUp} ${styles.delay4}`}>
        <div className="flex-grow" />
        <NextPageButton />
      </div>
    </div>
  </div>
}
