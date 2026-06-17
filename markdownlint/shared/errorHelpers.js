/**
 * Truncates text with ellipsis for display in error contexts.
 */
function ellipsify(text, start, end) {
  if (text.length <= 30) {
    // Nothing to do
  } else if (start && end) {
    text = text.slice(0, 15) + "..." + text.slice(-15);
  } else if (end) {
    text = "..." + text.slice(-30);
  } else {
    text = text.slice(0, 30) + "...";
  }
  return text;
}

/**
 * Creates an error object without reporting it.
 */
function createError(lineNumber, detail, fixInfo = {}) {
  return {
    lineNumber,
    detail,
    fixInfo,
  };
}

/**
 * Reports an error via onError callback.
 */
function addError(onError, lineNumber, detail, context, range, fixInfo) {
  onError({
    lineNumber,
    detail,
    context,
    range,
    fixInfo,
  });
}

/**
 * Reports an error when expected !== actual.
 */
function addErrorDetailIf(
  onError,
  lineNumber,
  expected,
  actual,
  detail,
  context,
  range,
  fixInfo
) {
  if (expected !== actual) {
    addError(
      onError,
      lineNumber,
      "Expected: " +
        expected +
        "; Actual: " +
        actual +
        (detail ? "; " + detail : ""),
      context,
      range,
      fixInfo
    );
  }
}

/**
 * Reports an error with ellipsified context.
 */
function addErrorContext(
  onError,
  lineNumber,
  context,
  left,
  right,
  range,
  fixInfo
) {
  context = ellipsify(context, left, right);
  addError(onError, lineNumber, undefined, context, range, fixInfo);
}

module.exports = {
  ellipsify,
  createError,
  addError,
  addErrorDetailIf,
  addErrorContext,
};
