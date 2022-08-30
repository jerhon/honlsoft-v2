


export function tagToUrl(tagName: string) {
  return "/tag/" + tagName.replace(" ", "-").replace(".", "").replace("#", "sharp").toLowerCase()
}
