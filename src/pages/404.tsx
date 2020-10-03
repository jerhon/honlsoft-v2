import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PageHeader from "../components/page-header"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <PageHeader title="NOT FOUND" breadcrumbs={undefined} />
    <br />
    <div className="centered">
      <p style={{ textAlign: "center" }}>
        You just hit a route that doesn&#39;t exist... the sadness.
      </p>
    </div>
  </Layout>
)

export default NotFoundPage
