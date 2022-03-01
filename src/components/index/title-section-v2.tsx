import React from "react";
import * as styles from "./title-section-v2.module.css";
import { NextPageButton } from "../next-page-button"

export function TitleSectionV2() {
  return <div className={styles.background}>
    <div className="flex flex-col h-screen flex text-white justify-center align-middle items-center min-h-[500px]">
      <div className="flex-grow align-middle flex mt-40">
        <div className="flex">
          <div className="m-auto text-3xl font-bold border-r-2 desktop:border-white p-4 text-right">Jeremy's Technology Blog</div>
          <div className="text-4xl text-center font-bold m-auto px-4 text-left">Let's build software people dream of using.</div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-grow" />
        <NextPageButton />

      </div>
    </div>

    <div className="text-sm opacity-70 self-center flex-grow absolute desktop:bottom-4 right-4 text-white bottom-24">
      Photo by <a href="https://unsplash.com/@grakozy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Greg Rakozy</a> on <a href="https://unsplash.com/s/photos/space?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
    </div>
  </div>
}
