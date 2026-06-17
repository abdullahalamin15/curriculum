/**
 * Extracts line ranges from fence tokens.
 * @param {Array} tokens - markdownit tokens
 * @param {Function} [filterFn] - optional predicate to filter fence tokens
 * @returns {Array<[number, number]>} line ranges
 */
function getFenceLineRanges(tokens, filterFn) {
  return tokens
    .filter((token) => {
      if (token.type !== "fence") return false;
      return filterFn ? filterFn(token) : true;
    })
    .map((token) => token.map);
}

/**
 * Checks whether a line number falls within any of the given ranges.
 * @param {number} lineNumber
 * @param {Array<[number, number]>} ranges
 * @returns {boolean}
 */
function isWithinLineRanges(lineNumber, ranges) {
  return ranges.some(
    (range) => range[0] < lineNumber && lineNumber < range[1]
  );
}

module.exports = { getFenceLineRanges, isWithinLineRanges };
