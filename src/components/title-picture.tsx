import React from "react";
import titlePictureStyles from "./title-picture.module.css";

// TODO: Parameterize Picture URL, Height

export class TitlePicture extends React.Component<{tagLine: string}> {

    render() {
        return (
            <div className={titlePictureStyles.container}>
                <h3 className={titlePictureStyles.tagLine}>{this.props.tagLine}</h3>
            </div>
        );
    }
    
}

export default TitlePicture;