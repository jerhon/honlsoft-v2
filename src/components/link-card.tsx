import React from "react";
import cardStyles from "./link-card.module.css";
import { Link } from "gatsby";

interface props {
    title: string,
    description: string,
    icon: string,
    url: string
}

const LinkCard = ({title, description, icon, url} : props ) => {

    return (
        <div className={cardStyles.card}>
            <Link to={url}>
                <div className={cardStyles.header}>
                    <img src={icon} className={cardStyles.icon}></img>
                    <h3 className={cardStyles.title}>{title}</h3>
                </div>
            </Link>
            <p className={cardStyles.description}>{description}</p>
        </div>
    );
}

export default LinkCard;