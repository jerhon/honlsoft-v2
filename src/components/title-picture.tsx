import React from "react";
import titlePictureStyles from "./title-picture.module.css";

// TODO: Parameterize Picture URL, Height

export interface Props {
    tagLine: string;
}

const TitlePicture = ({tagLine}) => (
            <div className={titlePictureStyles.container}>
                <h3 className={titlePictureStyles.tagLine}>{tagLine}</h3>
            </div>
        );

export default TitlePicture;