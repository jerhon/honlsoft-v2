import { slugFromUrl,  type Content } from "../lib/content"
import { createBlogData } from "./contentLoader";

declare const data: Content[]
export { data }

export default createBlogData("projects/*.md", "project", "projects"); 