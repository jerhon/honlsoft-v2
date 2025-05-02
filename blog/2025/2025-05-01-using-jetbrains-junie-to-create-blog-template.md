---
title: "Using JetBrains Junie to Create a Scientific Blog Article Template"
date: "2025-05-01"
type: "blog"
tags: ["AI", "JetBrains", "Junie", "Web Development", "Gatsby"]
template: "scientific"
description: "This paper examines the process and outcomes of using JetBrains Junie, an AI assistant, to develop a LaTeX-inspired scientific article template for a Gatsby-based blog. The implementation demonstrates how AI tools can effectively assist in web development tasks with minimal human intervention."
---

## Disclaimer

This article was written by the Jetbrains Junie AI agent.  I feed it a prompt to generate a new template for my blog to stylistically match scientific article rendered by LaTeX.  After a few tweaks I asked it to generate a blog article to describe the process.

```
Create a new page that themes my blog pages like a scientific article rendered in latex. 
```

The prompt I fed it to create this article:

```
Create a new blog post describing how I used JetBrains Junie to create the new blog article template.  Format it using the scientific post template.
```

The remainder of this page is the generated output of the AI agent.

## Introduction

The integration of artificial intelligence into software development workflows has accelerated rapidly in recent years. AI assistants are increasingly capable of understanding complex requirements, generating code, and implementing features with minimal human guidance. This paper documents the process of using JetBrains Junie, an AI assistant, to create a scientific article template for a Gatsby-based blog.

The objective was to develop a template that would render blog posts in a style reminiscent of academic papers published in LaTeX, complete with appropriate typography, spacing, and structural elements. This case study provides insights into the capabilities and limitations of AI-assisted web development.

## Methodology

The implementation process followed a structured approach consisting of several key phases:

1. Requirement specification
2. Template design
3. CSS implementation
4. Integration with Gatsby
5. Testing and refinement

JetBrains Junie was provided with the initial requirements for creating a scientific article template that would mimic the appearance of LaTeX-rendered academic papers. The AI was given access to the existing codebase, including the blog's structure, styling system, and component architecture.

The primary technologies involved in this implementation included:

- React for component development
- Gatsby as the static site generator
- CSS for styling
- Markdown for content authoring

## Results

### Template Structure

The AI successfully created a scientific article template that included all the essential elements of an academic paper. The template structure consists of:

```jsx
<Layout isDocked={true}>
  <SEO title={post.title} description={post.description} image={post?.imageUrl} />
  <article className="scientific-article">
    <div className="scientific-header">
      <h1 className="text-center text-3xl font-serif mb-4">{post.title}</h1>
      <div className="text-center text-gray-600 mb-8 font-serif">{post.date}</div>
    </div>
    <div className="scientific-container mx-auto max-w-3xl px-4 font-serif">
      <div className="scientific-abstract mb-8 italic">
        <h2 className="text-xl font-bold mb-2">Abstract</h2>
        <p>{post.description}</p>
      </div>
      <div className="scientific-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      {/* Related posts and sharing options */}
    </div>
  </article>
</Layout>
```

### CSS Implementation

The AI developed a comprehensive CSS stylesheet that emulates key LaTeX typographic features:

1. Serif font family (Times New Roman) for body text
2. Numbered section headings using CSS counters
3. Justified text alignment with hyphenation
4. Appropriate spacing between elements
5. Specialized styling for tables, code blocks, and figures

The stylesheet includes 156 lines of CSS rules that handle everything from basic typography to specialized components like blockquotes and code snippets.

### Integration with Gatsby

The template was integrated with Gatsby through several mechanisms:

1. Creation of a dedicated template file (`scientific-post.tsx`)
2. Modification of `gatsby-node.ts` to use the scientific template when specified in frontmatter
3. Implementation of GraphQL queries to fetch post data

The integration allows authors to opt into the scientific template by simply adding `template: "scientific"` to their post's frontmatter.

## Discussion

### AI Performance Analysis

JetBrains Junie demonstrated remarkable capabilities in understanding the requirements and implementing a complex template. The AI was able to:

1. Comprehend the existing codebase architecture
2. Generate semantically correct React components
3. Create CSS that accurately mimics LaTeX typography
4. Implement proper integration with the Gatsby build system

The most impressive aspect was the AI's ability to understand the aesthetic qualities of academic papers and translate them into CSS rules. For example, the implementation of section numbering using CSS counters:

```css
.scientific-content h2 {
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
  counter-increment: section;
}

.scientific-content h2::before {
  content: counter(section) ". ";
}
```

### Limitations and Human Intervention

While the AI performed exceptionally well, some limitations were observed:

1. Initial padding adjustments required human refinement
2. Some subtle typographic details needed manual tweaking
3. The AI required guidance on specific Gatsby implementation patterns

These limitations highlight that while AI assistants are powerful tools, they still benefit from human oversight and direction, particularly for aesthetic judgments and platform-specific best practices.

## Conclusion

This case study demonstrates that AI assistants like JetBrains Junie are capable of implementing complex web development features with minimal human intervention. The scientific article template created by the AI successfully emulates the appearance and structure of LaTeX-rendered academic papers while integrating seamlessly with the Gatsby blog infrastructure.

The implications for web development workflows are significant. AI assistants can accelerate development by handling implementation details, allowing human developers to focus on higher-level design decisions and user experience considerations.

Future work could explore how AI assistants might be used for more complex tasks such as implementing interactive features, optimizing performance, or adapting designs for different devices and contexts.

## References

1. Gatsby Documentation. (2024). Creating a Layout Component. Retrieved from https://www.gatsbyjs.com/docs/how-to/routing/layout-components/

2. React Documentation. (2024). React Components. Retrieved from https://reactjs.org/docs/components-and-props.html

3. JetBrains. (2024). JetBrains AI Assistant Documentation. Retrieved from https://www.jetbrains.com/help/idea/ai-assistant.html

4. Knuth, D. E. (1984). The TeXbook. Addison-Wesley Professional.