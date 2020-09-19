import React from "react";
import styles from "./responsive-grid.module.css";

/* Switches orientation of the items from horizontal to vertical if the size of the window gets below a threshold. */
function ResponsiveGrid({ children }) {
    return (<div className={styles.navigation}>
        {children}
    </div>);
}

export default ResponsiveGrid;
