const { lintWithRule } = require("../testHelper");
const rule = require("../TOP003_defaultSectionContent/TOP003_defaultSectionContent");

describe("TOP003 - default-section-content", () => {
  describe("lesson overview section", () => {
    test("passes with correct default content and list", async () => {
      const content = [
        "### Lesson overview",
        "",
        "This section contains a general overview of topics that you will learn in this lesson.",
        "",
        "- Item one.",
        "- Item two.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result).toHaveLength(0);
    });

    test("flags missing default content", async () => {
      const content = [
        "### Lesson overview",
        "",
        "- Item one.",
        "- Item two.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
    });

    test("flags nested lists", async () => {
      const content = [
        "### Lesson overview",
        "",
        "This section contains a general overview of topics that you will learn in this lesson.",
        "",
        "- Item one.",
        "  - Nested item.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((e) => e.errorDetail.includes("nested"))).toBe(true);
    });

    test("flags ordered lists", async () => {
      const content = [
        "### Lesson overview",
        "",
        "This section contains a general overview of topics that you will learn in this lesson.",
        "",
        "1. Item one.",
        "1. Item two.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((e) => e.errorDetail.includes("ordered"))).toBe(true);
    });

    test("flags missing bullet list", async () => {
      const content = [
        "### Lesson overview",
        "",
        "This section contains a general overview of topics that you will learn in this lesson.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("knowledge check section", () => {
    test("passes with correct default content and list", async () => {
      const content = [
        "### Knowledge check",
        "",
        "The following questions are an opportunity to reflect on key topics in this lesson. If you can't answer a question, click on it to review the material, but keep in mind you are not expected to memorize or master this knowledge.",
        "",
        "- [Question one?](https://example.com)",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result).toHaveLength(0);
    });

    test("flags missing default content", async () => {
      const content = [
        "### Knowledge check",
        "",
        "- [Question one?](https://example.com)",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("additional resources section", () => {
    test("passes with correct default content and list", async () => {
      const content = [
        "### Additional resources",
        "",
        "This section contains helpful links to related content. It isn't required, so consider it supplemental.",
        "",
        "- [Extra resource](https://example.com)",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result).toHaveLength(0);
    });

    test("flags missing default content", async () => {
      const content = [
        "### Additional resources",
        "",
        "- [Extra resource](https://example.com)",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
    });

    test("flags missing list when only default content is present", async () => {
      const content = [
        "### Additional resources",
        "",
        "This section contains helpful links to related content. It isn't required, so consider it supplemental.",
        "",
        "Some extra paragraph.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("assignment section", () => {
    test("passes with correct div wrapper", async () => {
      const content = [
        "### Assignment",
        "",
        '<div class="lesson-content__panel" markdown="1">',
        "",
        "1. Do this task.",
        "",
        "</div>",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result).toHaveLength(0);
    });

    test("flags missing div wrapper", async () => {
      const content = [
        "### Assignment",
        "",
        "1. Do this task.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].errorDetail).toMatch(/lesson-content__panel/);
    });
  });

  describe("non-matching sections", () => {
    test("ignores sections without default content requirements", async () => {
      const content = [
        "### Introduction",
        "",
        "Some free-form content here.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result).toHaveLength(0);
    });
  });

  describe("content after bullet list", () => {
    test("flags content after the bullet list in lesson overview", async () => {
      const content = [
        "### Lesson overview",
        "",
        "This section contains a general overview of topics that you will learn in this lesson.",
        "",
        "- Item one.",
        "",
        "Extra content after list.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.some((e) => e.errorDetail.includes("no additional content"))
      ).toBe(true);
    });
  });

  describe("default content position", () => {
    test("flags default content not immediately after heading", async () => {
      const content = [
        "### Lesson overview",
        "",
        "Some wrong content here.",
        "",
        "This section contains a general overview of topics that you will learn in this lesson.",
        "",
        "- Item one.",
      ].join("\n");
      const result = await lintWithRule(rule, content);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
