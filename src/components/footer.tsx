import React from "react";
import styles from "./footer.module.css";

function Footer() {
    return (<footer className={styles.footer}>
        <div className="page-width">
            © {new Date().getFullYear()} Jeremy Honl, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>.
          Images are from <a href="https://www.unsplash.com">Unsplash</a> by <a href="https://unsplash.com/@conorsexton?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Conor Sexton</a> and <a href="https://unsplash.com/@simonfitall?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Simon Fitall</a>
        </div>
    </footer>)
}

export default Footer;
