import React from "react";
import { Link } from "gatsby";

export interface BreadcrumbInfo {
    title: string;
    url: string;
}
export interface BreadcrumbProps {
    links: BreadcrumbInfo[];
}

function Breadcrumb({ links } : BreadcrumbProps) {
    let ret : JSX.Element[] = [];
    if (links.length > 0) {
        let linksArray = links.map((l) => (<Link key={l.title} to={l.url}>{l.title}</Link>))
        for (let link of linksArray) {
            ret.push(link);
            ret.push((<span key={link.key + ' span'}> &gt; </span>));
        }
        ret.pop();
    }
    return (<div>{ret}</div>);
};

export default Breadcrumb;