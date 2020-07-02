import React from "react";
import styles from "./responsive-grid.module.css";

/* Switches orientation of the items from horizontal to vertical if the size of the window get's below a threshold. */
const ResponsiveGrid = ({ children }) => 
    (<div className={styles.navigation}>
        {children}
    </div>);

export default ResponsiveGrid;