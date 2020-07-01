import React from "react";
import cardStyles from "./link-card.module.css";
import { Link } from "gatsby";

class LinkCard extends React.Component<{title: string, description: string, icon: string, url: string}> {

    render() {
        return (
            <div className={cardStyles.card}>
                <Link to={this.props.url}>
                    <div className={cardStyles.header}>
                        <img src={this.props.icon} className={cardStyles.icon}></img>
                        <h3 className={cardStyles.title}>{this.props.title}</h3>
                    </div>
                </Link>
                <p className={cardStyles.description}>{this.props.description}</p>
            </div>
        );
    }
}

export default LinkCard;