import React from "react";
import styles from "./footer.module.css";

function Footer() {
    return (<footer className={styles.footer}>
        <div className="page-width">
            © {new Date().getFullYear()} Jeremy Honl, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>. 
          Mountain image is from <a href="https://www.unsplash.com">Unsplash</a>.
        </div>
    </footer>)
}

export default Footer;