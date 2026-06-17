const { lintWithRule } = require("../testHelper");
const rule = require("../TOP008_useBackticksForFencedCodeBlocks/TOP008_useBackticksForFencedCodeBlocks");

describe("TOP008 - use-backticks-for-fenced-code-blocks", () => {
  test("flags tilde fenced code block", async () => {
    const content = "~~~\nsome code\n~~~";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(2);
    expect(result[0].ruleNames).toContain("TOP008");
  });

  test("does not flag backtick fenced code block", async () => {
    const content = "```\nsome code\n```";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(0);
  });

  test("provides fix to replace tildes with backticks", async () => {
    const content = "~~~\ncode\n~~~";
    const result = await lintWithRule(rule, content);
    expect(result[0].fixInfo.insertText).toBe("```");
    expect(result[0].fixInfo.deleteCount).toBe(3);
  });

  test("handles four tildes", async () => {
    const content = "~~~~\ncode\n~~~~";
    const result = await lintWithRule(rule, content);
    expect(result[0].fixInfo.insertText).toBe("````");
    expect(result[0].fixInfo.deleteCount).toBe(4);
  });

  test("flags tilde block with language specifier", async () => {
    const content = "~~~javascript\ncode\n~~~";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(2);
  });

  test("reports correct line numbers for opening and closing", async () => {
    const content = "~~~\nline 1\nline 2\n~~~";
    const result = await lintWithRule(rule, content);
    expect(result[0].lineNumber).toBe(1);
    expect(result[1].lineNumber).toBe(4);
  });

  test("includes context in error", async () => {
    const content = "~~~\ncode\n~~~";
    const result = await lintWithRule(rule, content);
    expect(result[0].errorContext).toBe("~~~");
  });

  test("flags multiple tilde blocks", async () => {
    const content = "~~~\nblock 1\n~~~\n\n~~~\nblock 2\n~~~";
    const result = await lintWithRule(rule, content);
    expect(result).toHaveLength(4);
  });
});
