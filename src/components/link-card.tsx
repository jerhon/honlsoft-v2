import { Link } from "gatsby";
import React from "react";
import cardStyles from "./link-card.module.css";

interface props {
    title: string,
    description: string,
    icon: string,
    url: string
}

function LinkCard({title, description, icon, url} : props ) {

    return (
        <div className={cardStyles.card}>
            <Link to={url}>
                <div><img src={icon} className={cardStyles.icon} alt={title} /></div>
                <div className={cardStyles.header}>
                    <h3 className={cardStyles.title}>{title}</h3>
                </div>
            </Link>
            <p className={cardStyles.description}>{description}</p>
        </div>
    );
}

export default LinkCard;
