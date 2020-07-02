import React from "react";
import styles from "./pager.module.css";

export interface Props {
    backUrl?: string;
    forwardUrl?: string;
}

const Pager = ({backUrl, forwardUrl} : Props) => {

    let left = backUrl ? <a href={backUrl}><img src="/img/arrow_left.svg" /> Previous</a> : <></>;
    let right = forwardUrl ? <a href={forwardUrl}>Next<img src="/img/arrow_right.svg" /></a> : <></>

    return <div className={styles.pager}>
        {left}
        {right}
    </div>
};

export default Pager;