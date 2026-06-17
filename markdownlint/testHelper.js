const markdownlint = require("markdownlint");

function lintWithRule(rule, content, config = {}) {
  return new Promise((resolve, reject) => {
    markdownlint(
      {
        strings: { test: content },
        config: { default: false, [rule.names[0]]: config === false ? false : true, ...config },
        customRules: [rule],
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.test);
      }
    );
  });
}

module.exports = { lintWithRule };
