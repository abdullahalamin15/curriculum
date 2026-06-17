const { lintWithRule } = require("../testHelper");
const rule = require("../TOP010_useLazyNumbering/TOP010_useLazyNumbering");

describe("TOP010 - lazy-numbering-for-ordered-lists", () => {
  test("passes with lazy numbering (all 1.)", async () => {
    const content = "1. First\n1. Second\n1. Third";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("flags incremental numbering", async () => {
    const content = "1. First\n2. Second\n3. Third";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(2);
  });

  test("flags single non-1 prefix", async () => {
    const content = "1. First\n2. Second";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].lineNumber).toBe(2);
  });

  test("provides fix to replace number with 1", async () => {
    const content = "1. First\n2. Second";
    const result = await lintWithRule(rule, content);
    expect(result[0].fixInfo.insertText).toBe("1");
    expect(result[0].fixInfo.deleteCount).toBe(1);
  });

  test("handles large numbers", async () => {
    const content = "1. First\n10. Tenth";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
    expect(result[0].fixInfo.insertText).toBe("1");
  });

  test("does not flag unordered lists", async () => {
    const content = "- First\n- Second\n- Third";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("handles indented ordered list items", async () => {
    const content = "1. First\n   1. Nested first\n   2. Nested second";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(1);
  });

  test("includes detail with expected vs actual", async () => {
    const content = "1. First\n2. Second";
    const result = await lintWithRule(rule, content);
    expect(result[0].errorDetail).toMatch(/Expected.*1/);
    expect(result[0].errorDetail).toMatch(/Actual.*2/);
  });
});
