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
      <Link to={url} className={cardStyles.card}>
        <div><img src={icon} className={cardStyles.icon} alt={title} /></div>
        <div className={cardStyles.header}>
            <h3 className={cardStyles.title}>{title}</h3>
        </div>
        <p className={cardStyles.description}>{description}</p>
      </Link>
    );
}

export default LinkCard;
