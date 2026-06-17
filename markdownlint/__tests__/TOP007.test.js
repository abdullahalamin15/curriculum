const { lintWithRule } = require("../testHelper");
const rule = require("../TOP007_useMarkdownLinks/TOP007_useMarkdownLinks");

describe("TOP007 - use-markdown-links", () => {
  test("flags HTML anchor tag with href", async () => {
    const content = 'Use <a href="https://example.com">Example</a> for reference.';
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].ruleNames).toContain("TOP007");
  });

  test("does not flag markdown links", async () => {
    const content = "Use [Example](https://example.com) for reference.";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("provides fix info to convert to markdown link", async () => {
    const content = '<a href="https://example.com">Example</a>';
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].fixInfo.insertText).toBe("[Example](https://example.com)");
  });

  test("does not flag anchor tags inside fenced code blocks", async () => {
    const content = '```html\n<a href="https://example.com">Link</a>\n```';
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("does not flag anchor tags inside CodePen embeds", async () => {
    const content = [
      "Some intro text",
      "",
      '<p class="codepen" data-height="300">',
      "",
      '<a href="https://codepen.io/user/pen/abc">See the Pen</a>',
      "",
      "</p>",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("does not flag anchor wrapped in backticks", async () => {
    const content = 'Use `<a href="https://example.com">link</a>` syntax.';
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("flags multiple anchors on same line", async () => {
    const content = '<a href="https://a.com">A</a> and <a href="https://b.com">B</a>';
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(2);
  });

  test("handles single-quoted href attributes", async () => {
    const content = "<a href='https://example.com'>Example</a>";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].fixInfo.insertText).toBe("[Example](https://example.com)");
  });

  test("does not flag anchor tag without closing tag on same line", async () => {
    const content = '<a href="https://example.com">Link text\non next line</a>';
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("reports correct line number", async () => {
    const content = 'Paragraph\n\n<a href="https://example.com">Link</a>';
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].lineNumber).toBe(3);
  });
});
