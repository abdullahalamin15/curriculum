const { lintWithRule } = require("../testHelper");
const rule = require("../TOP001_descriptiveLinkText/TOP001_descriptiveLinkText");

describe("TOP001 - descriptive-link-text", () => {
  test("flags link text containing 'here'", async () => {
    const result = await lintWithRule(rule, "Click [here](https://example.com) for info");
    expect(result).toHaveLength(1);
    expect(result[0].ruleNames).toContain("TOP001");
    expect(result[0].errorDetail).toMatch(/this.*or.*here/i);
  });

  test("flags link text containing 'this'", async () => {
    const result = await lintWithRule(rule, "See [this](https://example.com) for details");
    expect(result).toHaveLength(1);
  });

  test("flags case-insensitive 'Here'", async () => {
    const result = await lintWithRule(rule, "Click [Here](https://example.com)");
    expect(result).toHaveLength(1);
  });

  test("flags case-insensitive 'THIS'", async () => {
    const result = await lintWithRule(rule, "See [THIS](https://example.com)");
    expect(result).toHaveLength(1);
  });

  test("does not flag descriptive link text", async () => {
    const result = await lintWithRule(rule, "[The Odin Project](https://theodinproject.com)");
    expect(result).toHaveLength(0);
  });

  test("does not flag 'here' as part of another word", async () => {
    const result = await lintWithRule(rule, "[somewhere](https://example.com)");
    expect(result).toHaveLength(0);
  });

  test("does not flag 'this' as part of another word", async () => {
    const result = await lintWithRule(rule, "[thistle](https://example.com)");
    expect(result).toHaveLength(0);
  });

  test("does not flag 'here' inside backticks in link text", async () => {
    const result = await lintWithRule(rule, "[the `here` property](https://example.com)");
    expect(result).toHaveLength(0);
  });

  test("does not flag 'this' inside backticks in link text", async () => {
    const result = await lintWithRule(rule, "[the `this` keyword](https://example.com)");
    expect(result).toHaveLength(0);
  });

  test("flags multiple links on separate lines", async () => {
    const content = "Click [here](https://a.com) and [here](https://b.com)";
    const result = await lintWithRule(rule, content);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  test("includes context in error output", async () => {
    const result = await lintWithRule(rule, "Click [here](https://example.com)");
    expect(result[0].errorContext).toBe("[here](https://example.com)");
  });
});
