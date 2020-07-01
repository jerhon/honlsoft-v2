import { BreadcrumbInfo } from "./components/breadcrumb";

export interface PostMetadata {
    frontmatter : {
        type?: string;
        page?: string;
        title?: string;
    }
    parent : {
        name: string;
    }


} 


export function capitalize(word: String) {
    return word.substr(0, 1).toUpperCase() + word.substring(1);
}
export function singular(word: String) {
    return word.endsWith("s") ? word.substring(0, word.length - 1) : word;
}
export function plural(word: String) {
    return word.endsWith("s") ? word : word + "s";
}

export function getPostUrl(post: PostMetadata) {
    if (post.frontmatter.page) {
        return '/' + post.frontmatter.page;
    } else {
        return '/' + post.frontmatter.type + '/' + post.parent.name;
    }
}

export function getPostBreadcrumbs(post: PostMetadata): BreadcrumbInfo[] {
    if (post.frontmatter.page) {
        return [
            { title: 'Home', url: '/'},
            { title: capitalize(post.frontmatter.page), url: '/' + post.frontmatter.page}
        ];
    } else {
        return [
            { title: 'Home', url: '/' },
            { title: capitalize(post.frontmatter.type ?? ""), url: '/' + post.frontmatter.type },
            { title: capitalize(post.frontmatter.title ?? ""), url:  '/' + post.frontmatter.type + '/' + post.parent.name }
        ]
    }
}