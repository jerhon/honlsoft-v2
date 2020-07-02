import React from "react"

import { Layout } from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <br />
    <div className="centered">
    <h1 style={{textAlign: 'center'}}>NOT FOUND</h1>
    <p style={{textAlign: 'center'}}>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
)

export default NotFoundPage
