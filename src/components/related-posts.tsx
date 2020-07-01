import React from "react";
import { graphql } from "gatsby";

export interface props {
    links: {
        title: string;
        url: string;
    }[];
}

const RelatedPosts = (props: props) => {

    if (props.links.length) {
        let links = props.links.map((n) => (<li><a href={n.url}>{n.title}</a></li>));

        return (<div>
            <h3>Related Posts</h3>
            <ul>
                {links}
            </ul>
        </div>);        
    } else {
        return (<></>);
    }
};


export default RelatedPosts;