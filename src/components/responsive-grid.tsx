import React from "react";
import styles from "./responsive-grid.module.css";

/* Switches orientation of the items from horizontal to vertical if the size of the window get's below a threshold. */
export class ResponsiveGrid extends React.Component {

    render() {
        return (<div className={styles.navigation}>
            {this.props.children}
        </div>);
    }
}