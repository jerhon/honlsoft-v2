export interface ContentCard {
  title: string
  description: string
  date?: string
  image?: string
  excerpt: string
  tags: string[]
  url: string
  slug: string
  template?: string
}

export interface ProjectCard {
  title: string
  description: string
  date?: string
  image?: string
  excerpt: string
  url: string
  slug: string
  project?: string
}

export function slugFromUrl(url: string) {
  const normalized = url.replace(/\/$/, "")
  const segments = normalized.split("/")
  const lastSegment = segments[segments.length - 1] ?? ""
  return lastSegment.replace(/\.(html|md)$/, "")
}

export function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function formatDate(value?: string) {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date)
}

export function tagToSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map(part => part.substring(0, 1).toUpperCase() + part.substring(1))
    .join(" ")
}
