import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"
import React from "react"
import PageHeader from "../components/layout/page-header"
import { Container } from "../components/ui/container"

const dotNetLinks = {
  title: ".NET",
  links: [
    { title: ".NET Documentation", href: "https://learn.microsoft.com/en-us/dotnet/core/sdk" },
    { title: "JetBrains Rider Documentation", href: "https://www.jetbrains.com/rider/documentation/" },
    { title: "NuGet", href: "https://www.nuget.org/" },
    { title: "Visual Studio Magazine", href: "https://visualstudiomagazine.com/Home.aspx"}
  ]
}

const developerNews = {
  title: "Developer and Technology News",
  links: [
    { title: "Ars Technica", href: "https://arstechnica.com/" },
    { title: "CNET", href: "https://www.cnet.com/" },
    { title: "Software Development Times", href: "https://www.sdtimes.com" },
    { title: "Tech Crunch", href: "https://techcrunch.com/"},
  ]
}

const podcasts = {
  title: "Blogs and Podcasts",
  links: [
    { title: ".NET Blogs (Microsoft)", href: "https://devblogs.microsoft.com/dotnet/" },
    { title: "Code Opinion", href: "https://codeopinion.com/" },
    { title: "JetBrains .NET Annotated", href: "https://blog.jetbrains.com/dotnet/tag/net-annotated/" },
    { title: "Coding Blocks .NET", href: "https://www.codingblocks.net/" },
    { title: "Khalid Abuhakmeh", href: "https://khalidabuhakmeh.com/"},
    { title: "Mikesdotnetting", href: "https://www.mikesdotnetting.com/" },
    { title: "Scott Hanselman", href: "https://www.hanselman.com/" }
  ]
}

const allSections = [dotNetLinks, developerNews, podcasts]

export function LinksPage() {
  return (
    <Layout isDocked={true}>
      <SEO title="Links" description="Contains various useful links." />
      <article>
        <PageHeader title="Links" breadcrumbs={[{ title: "Home", url: "/" }, { title: "Links", url: "/links" }]} />
        <Container>
          <div className="flex flex-row flex-wrap">
            <AllLinks />
          </div>
        </Container>
      </article>
    </Layout>
  )
}

function AllLinks() {
  return <>
    {allSections.map((l) => <LinkSection key={l.title} {...l} />)}
  </>
}

function LinkSection(props: { title: string, links: { title: string, href: string }[]})
{
  return <div className="m-4 flex-grow">
    <div className="text-lg font-bold">{props.title}</div>
    <ul className="list-none p-0 m-0">
      {props.links.map((l) => <li className="m-0 p-0"><a href={l.href}>{l.title}</a></li>)}
    </ul>
  </div>
}


export default LinksPage
