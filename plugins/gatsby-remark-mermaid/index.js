var visit = require("unist-util-visit");

module.exports = ({ markdownAST }, pluginOptions) => {
  visit(markdownAST, "code", node => {
    console.log(node);
    if (node?.lang === "mermaid") {
      node.type = "html";
      node.lang = undefined;
      node.children = undefined;
      node.value = "<div class=\"mermaid\">" + node.value + "</div>";
    }
    console.log(node);
  })

  console.log(markdownAST);

  return markdownAST
}
