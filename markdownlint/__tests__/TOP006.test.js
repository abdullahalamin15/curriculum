const { lintWithRule } = require("../testHelper");
const rule = require("../TOP006_fullFencedCodeLanguage/TOP006_fullFencedCodeLanguage");

describe("TOP006 - full-fenced-code-language", () => {
  test("flags 'js' abbreviation", async () => {
    const content = "```js\nconsole.log('hi');\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].errorDetail).toMatch(/Expected: javascript.*Actual: js/);
  });

  test("flags 'rb' abbreviation", async () => {
    const content = "```rb\nputs 'hi'\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].errorDetail).toMatch(/Expected: ruby.*Actual: rb/);
  });

  test("flags 'txt' abbreviation", async () => {
    const content = "```txt\nsome text\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].errorDetail).toMatch(/Expected: text.*Actual: txt/);
  });

  test("flags 'md' abbreviation", async () => {
    const content = "```md\n# heading\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].errorDetail).toMatch(/Expected: markdown.*Actual: md/);
  });

  test("flags 'sh' abbreviation", async () => {
    const content = "```sh\necho hi\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].errorDetail).toMatch(/Expected: bash.*Actual: sh/);
  });

  test("flags 'yml' abbreviation", async () => {
    const content = "```yml\nkey: value\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].errorDetail).toMatch(/Expected: yaml.*Actual: yml/);
  });

  test("does not flag full language name 'javascript'", async () => {
    const content = "```javascript\nconsole.log('hi');\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("does not flag full language name 'ruby'", async () => {
    const content = "```ruby\nputs 'hi'\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("does not flag languages without abbreviation mapping", async () => {
    const content = "```python\nprint('hi')\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("does not flag fenced code block without language", async () => {
    const content = "```\nsome code\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("provides fix info to replace abbreviation with full name", async () => {
    const content = "```js\ncode\n```";
    const result = await lintWithRule(rule, content);
    expect(result[0].fixInfo.insertText).toBe("javascript");
    expect(result[0].fixInfo.deleteCount).toBe(2);
  });

  test("handles tilde fences with abbreviation", async () => {
    const content = "~~~js\ncode\n~~~";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
  });

  test("flags multiple abbreviated code blocks", async () => {
    const content = "```js\ncode\n```\n\n```rb\ncode\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(2);
  });
});
