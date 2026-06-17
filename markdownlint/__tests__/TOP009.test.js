const { lintWithRule } = require("../testHelper");
const rule = require("../TOP009_lessonOverviewItemsSentenceStructure/TOP009_lessonOverviewItemsSentenceStructure");

describe("TOP009 - lesson-overview-items-sentence-structure", () => {
  test("passes when items start with capital and end with period", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- Learn about variables.",
      "- Understand scope.",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("flags item starting with lowercase", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- learn about variables.",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
  });

  test("flags item not ending with period", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- Learn about variables",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
  });

  test("flags item starting with lowercase AND not ending with period", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- learn about variables",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
  });

  test("flags items ending with question mark", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- What are variables?",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
  });

  test("does not flag bullet lists outside lesson overview", async () => {
    const content = [
      "### Other section",
      "",
      "- lowercase item without period",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("handles multiple invalid items", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- learn one",
      "- learn two",
      "- Learn three.",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(2);
  });

  test("reports correct line number for error", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- Valid item.",
      "- invalid item",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].lineNumber).toBe(4);
  });

  test("includes context in error", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- learn about variables",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result[0].errorContext).toBe("learn about variables");
  });

  test("stops checking after bullet list closes", async () => {
    const content = [
      "### Lesson overview",
      "",
      "- Valid item.",
      "",
      "### Another section",
      "",
      "- lowercase no period",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("does not flag content when no bullet list is present", async () => {
    const content = [
      "### Lesson overview",
      "",
      "Just a paragraph, no list.",
    ].join("\n");
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });
});
