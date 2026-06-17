const { lintWithRule } = require("../testHelper");
const rule = require("../TOP002_noCodeInHeadings/TOP002_noCodeInHeadings");

describe("TOP002 - no-code-headings", () => {
  test("flags inline code in heading", async () => {
    const result = await lintWithRule(rule, "## Using `console.log`");
    expect(result).toHaveLength(1);
    expect(result[0].ruleNames).toContain("TOP002");
    expect(result[0].errorContext).toBe("`console.log`");
  });

  test("flags multiple code spans in single heading", async () => {
    const result = await lintWithRule(rule, "## Use `let` and `const`");
    expect(result).toHaveLength(2);
  });

  test("does not flag heading without code", async () => {
    const result = await lintWithRule(rule, "## Introduction\n\nSome content");
    expect(result).toHaveLength(0);
  });

  test("does not flag inline code in paragraph", async () => {
    const result = await lintWithRule(rule, "## Title\n\nUse `console.log` here.");
    expect(result).toHaveLength(0);
  });

  test("provides fix info to remove backticks", async () => {
    const result = await lintWithRule(rule, "## The `Array` type");
    expect(result).toHaveLength(1);
    expect(result[0].fixInfo).toBeDefined();
    expect(result[0].fixInfo.insertText).toBe("Array");
  });

  test("flags code in h1 heading", async () => {
    const result = await lintWithRule(rule, "# Using `git`");
    expect(result).toHaveLength(1);
  });

  test("flags code in h3 heading", async () => {
    const result = await lintWithRule(rule, "### The `map` method");
    expect(result).toHaveLength(1);
  });

  test("reports correct line number", async () => {
    const content = "## Introduction\n\n## Using `forEach`";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].lineNumber).toBe(3);
  });
});
