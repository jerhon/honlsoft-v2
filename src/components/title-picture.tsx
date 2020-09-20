import React from "react";
import titlePictureStyles from "./title-picture.module.css";

// TODO: Parameterize Picture URL, Height

export interface Props {
    tagLine: string;
    className?: string;
}

function TitlePicture({tagLine, className}) {
  const classes = className ? titlePictureStyles.container + " " + className : titlePictureStyles;
  return (<div className={classes}>
      <h3 className={titlePictureStyles.tagLine}>{tagLine}</h3>
  </div>);
}

export default TitlePicture;
