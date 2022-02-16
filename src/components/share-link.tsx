import React from "react";
import { FaTwitter, FaLinkedin } from "react-icons/fa"

interface InternalShareLinkProps {
  url: string;
  children: React.ReactNode;
}

function InternalShareLink(props: InternalShareLinkProps) {
  return <a href={props.url} target="_blank">
    {props.children}
  </a>
}

export function TwitterShareLink(props: {url: string, title: string}) {
  const twitterUrl = "https://twitter.com/intent/tweet/?text=" + encodeURI(props.title) +"&url=" + encodeURI(props.url) + "&via=honlsoft"
  return <InternalShareLink url={twitterUrl}><FaTwitter /></InternalShareLink>
}

export function LinkedInShareLink(props: {url: string}) {
  const twitterUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURI(props.url)
  return <InternalShareLink url={twitterUrl}><FaLinkedin /></InternalShareLink>
}
