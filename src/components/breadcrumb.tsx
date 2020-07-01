import React from "react";
import { Link } from "gatsby";
import { JsxAttribute } from "typescript";

export interface BreadcrumbInfo {
    title: string;
    url: string;
}

const Breadcrumb = ({ links  }) => {
    let ret : JSX.Element[] = [];
    if (links.length > 0) {
        let linksArray = links.map((l) => (<Link key={l.title} to={l.url}>{l.title}</Link>))
        for (let link of linksArray) {
            ret.push(link);
            ret.push((<span> &gt; </span>));
        }
        ret.pop();
    }
    return (<div>{ret}</div>);
};

export default Breadcrumb;