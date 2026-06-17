const { lintWithRule } = require("../testHelper");
const rule = require("../TOP005_blanksAroundMultilineHtmlTags/TOP005_blanksAroundMultilineHtmlTags");

describe("TOP005 - blanks-around-multiline-html-tags", () => {
  test("passes when HTML tag is surrounded by blank lines", async () => {
    const content = "Some text\n\n<div>\n\nContent\n\n</div>\n\nMore text";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("flags HTML tag without blank line before", async () => {
    const content = "Some text\n<div>\n\nContent\n\n</div>\n\nMore text";
    const result = await lintWithRule(rule, content);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].errorDetail).toMatch(/before the tag/);
  });

  test("flags HTML tag without blank line after", async () => {
    const content = "Some text\n\n<div>\nContent\n\n</div>\n\nMore text";
    const result = await lintWithRule(rule, content);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].errorDetail).toMatch(/after the tag/);
  });

  test("flags tag missing blank lines both before and after", async () => {
    const content = "Some text\n<div>\nContent";
    const result = await lintWithRule(rule, content);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].errorDetail).toMatch(/before the tag.*and.*after the tag/);
  });

  test("ignores HTML inside html fenced code blocks", async () => {
    const content = "```html\n<div>\n<p>Content</p>\n</div>\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("ignores HTML inside jsx fenced code blocks", async () => {
    const content = "```jsx\n<div>\n<p>Content</p>\n</div>\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("ignores HTML inside erb fenced code blocks", async () => {
    const content = "```erb\n<div>\n<p>Content</p>\n</div>\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("does not flag HTML next to code block delimiters", async () => {
    const content = "```\n<div>\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("does not flag HTML comment lines", async () => {
    const content = "Some text\n\n<!-- comment -->\n\nMore text";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("provides fix info with correct replacement text", async () => {
    const content = "Some text\n<div>\n\nContent";
    const result = await lintWithRule(rule, content);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].fixInfo).toBeDefined();
    expect(result[0].fixInfo.insertText).toContain("\n");
  });

  test("handles self-closing tags", async () => {
    const content = "Some text\n<br/>\nMore text";
    const result = await lintWithRule(rule, content);
    expect(result.length).toBeGreaterThan(0);
  });
});
