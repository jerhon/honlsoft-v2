import React from "react";
import Breadcrumb, { BreadcrumbInfo } from "./breadcrumb";

export interface Props {
    title: string;
    breadcrumbs: BreadcrumbInfo[];
}

const PageHeader = ({title, breadcrumbs}) => {
    return (<div className="blue-back">
        <div className="page-width">
        <h1 style={{ margin: '50px 0px' }}>{title}</h1>
        <div><Breadcrumb links={breadcrumbs} ></Breadcrumb></div>
        </div>
    </div>);
}

export default PageHeader;