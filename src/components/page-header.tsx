import React from "react";
import { Link } from "gatsby";
import Breadcrumb, { BreadcrumbInfo } from "./breadcrumb";


const PageHeader = ({title, breadcrumbs} : {title: string, breadcrumbs: BreadcrumbInfo[]}) => {
    
    return (<div className="blue-back">
        <div className="page-width">
        <h1 style={{height: '150px', verticalAlign: 'middle', lineHeight: '150px'}}>{title}</h1>
        
        <div><Breadcrumb links={breadcrumbs} ></Breadcrumb></div>
        </div>
    </div>);
}

export default PageHeader;