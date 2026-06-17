const { lintWithRule } = require("../testHelper");
const rule = require("../TOP004_lessonHeadings/TOP004_lessonHeadings");

function lintWithConfig(content, headings, matchCase = false) {
  const markdownlint = require("markdownlint");
  return new Promise((resolve, reject) => {
    markdownlint(
      {
        strings: { test: content },
        config: { default: false, TOP004: { headings, match_case: matchCase } },
        customRules: [rule],
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.test);
      }
    );
  });
}

describe("TOP004 - lesson-headings", () => {
  test("passes when headings match required order", async () => {
    const content = "### Introduction\n\n### Lesson overview\n\n### Assignment";
    const headings = ["### Introduction", "### Lesson overview", "### Assignment"];
    const result = await lintWithConfig(content, headings);
    expect(result).toHaveLength(0);
  });

  test("flags when heading order does not match", async () => {
    const content = "### Assignment\n\n### Introduction";
    const headings = ["### Introduction", "### Assignment"];
    const result = await lintWithConfig(content, headings);
    expect(result.length).toBeGreaterThan(0);
  });

  test("supports wildcard matching any heading", async () => {
    const content = "### Introduction\n\n### Custom heading\n\n### Assignment";
    const headings = ["### Introduction", "*", "### Assignment"];
    const result = await lintWithConfig(content, headings);
    expect(result).toHaveLength(0);
  });

  test("supports wildcard matching multiple headings", async () => {
    const content = "### Introduction\n\n### Foo\n\n### Bar\n\n### Assignment";
    const headings = ["### Introduction", "*", "### Assignment"];
    const result = await lintWithConfig(content, headings);
    expect(result).toHaveLength(0);
  });

  test("supports level-constrained wildcard (## *)", async () => {
    const content = "## First\n\n## Second\n\n### Sub heading";
    const headings = ["## *", "### Sub heading"];
    const result = await lintWithConfig(content, headings);
    expect(result).toHaveLength(0);
  });

  test("flags wrong heading level for level-constrained wildcard", async () => {
    const content = "### Wrong level\n\n## Expected";
    const headings = ["## *", "## Expected"];
    const result = await lintWithConfig(content, headings);
    expect(result.length).toBeGreaterThan(0);
  });

  test("is case-insensitive by default", async () => {
    const content = "### introduction";
    const headings = ["### Introduction"];
    const result = await lintWithConfig(content, headings);
    expect(result).toHaveLength(0);
  });

  test("respects match_case option", async () => {
    const content = "### introduction";
    const headings = ["### Introduction"];
    const result = await lintWithConfig(content, headings, true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("does nothing when headings config is not an array", async () => {
    const result = await lintWithRule(rule, "### Whatever heading");
    expect(result).toHaveLength(0);
  });

  test("flags missing required headings", async () => {
    const content = "### Introduction";
    const headings = ["### Introduction", "### Assignment"];
    const result = await lintWithConfig(content, headings);
    expect(result.length).toBeGreaterThan(0);
  });

  test("flags wrong level heading within level-constrained wildcard section", async () => {
    const content = "## First\n\n### Wrong level\n\n## Assignment";
    const headings = ["## *", "## Assignment"];
    const result = await lintWithConfig(content, headings);
    expect(result.length).toBeGreaterThan(0);
  });

  test("ellipsifies long heading context in error", async () => {
    const longHeading = "### " + "A".repeat(50);
    const content = longHeading;
    const headings = ["### Introduction"];
    const result = await lintWithConfig(content, headings);
    expect(result.length).toBeGreaterThan(0);
  });

  test("handles all-wildcard required headings with no actual headings", async () => {
    const content = "Just a paragraph, no headings.";
    const headings = ["*"];
    const result = await lintWithConfig(content, headings);
    expect(result).toHaveLength(0);
  });

  test("flags when heading appears after matchAny resets", async () => {
    const content = "### Intro\n\n### Custom\n\n### Wrong";
    const headings = ["### Intro", "*", "### Assignment"];
    const result = await lintWithConfig(content, headings);
    expect(result.length).toBeGreaterThan(0);
  });
});
