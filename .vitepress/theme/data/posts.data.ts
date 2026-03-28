import { createContentLoader } from "vitepress"

import {  type Content } from "../lib/content"
import { createBlogData } from "./contentLoader";

declare const data: Content[]
export { data }

export default createBlogData("blog/**/*.md", "blog");
