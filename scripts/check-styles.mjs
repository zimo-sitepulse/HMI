import { readFile } from "node:fs/promises";
import process from "node:process";
import postcss from "postcss";

// Guard against recreating the prototype's stack of selector/property overrides.
const files = [
  "src/styles/theme.css",
  "src/styles/panel.css",
  "src/styles/responsive.css",
];
let errors = 0;
for (const file of files) {
  const root = postcss.parse(await readFile(file, "utf8"), { from: file });
  const selectors = new Set();
  root.walkRules((rule) => {
    const ancestry = [];
    for (
      let parent = rule.parent;
      parent && parent.type !== "root";
      parent = parent.parent
    ) {
      if (parent.type === "atrule")
        ancestry.unshift(`@${parent.name} ${parent.params}`);
    }
    const context = ancestry.join(" / ");
    const selector = rule.selector.replace(/\s+/g, " ");
    const key = `${context} / ${selector}`;
    const report = (message) => {
      console.error(`${file}:${rule.source.start.line}: ${message}`);
      errors++;
    };
    if (selectors.has(key))
      report(`Duplicate selector in the same scope: ${selector}`);
    selectors.add(key);
    const properties = new Set();
    rule.walkDecls((declaration) => {
      const property = declaration.prop;
      if (properties.has(property))
        report(`Duplicate property '${property}' in ${selector}`);
      properties.add(property);
    });
  });
}
if (errors) process.exitCode = 1;
else
  console.log(
    "Style structure: no repeated selectors or properties within a scope.",
  );
