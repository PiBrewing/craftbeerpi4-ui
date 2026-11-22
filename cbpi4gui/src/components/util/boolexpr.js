// Evaluates the boolean expressions of the dashboard path animation, once the
// actor names have been replaced by true/false. It used to go through eval(),
// which ran whatever the dashboard config held; this only knows true, false,
// parentheses and the logical and comparison operators. Anything else throws.
const TOKEN = /\s*(true|false|===|!==|==|!=|&&|\|\||[!&|^()])/y;

const tokenize = (expression) => {
  const tokens = [];
  TOKEN.lastIndex = 0;
  while (TOKEN.lastIndex < expression.length) {
    if (/^\s*$/.test(expression.slice(TOKEN.lastIndex))) break;
    const start = TOKEN.lastIndex;
    const match = TOKEN.exec(expression);
    if (!match) throw new SyntaxError(`Unexpected "${expression.slice(start).trim()}" in "${expression}"`);
    tokens.push(match[1]);
  }
  return tokens;
};

// Lowest to highest precedence, as in JavaScript.
const BINARY = [
  ["||"],
  ["&&"],
  ["|"],
  ["^"],
  ["&"],
  ["==", "!=", "===", "!=="],
];

const apply = (op, a, b) => {
  switch (op) {
    case "||": return a || b;
    case "&&": return a && b;
    case "|": return Boolean(a | b);
    case "^": return Boolean(a ^ b);
    case "&": return Boolean(a & b);
    case "==":
    case "===": return a === b;
    default: return a !== b;
  }
};

export const evalBoolExpression = (expression) => {
  const tokens = tokenize(expression);
  let pos = 0;

  const unary = () => {
    const token = tokens[pos++];
    if (token === "!") return !unary();
    if (token === "true") return true;
    if (token === "false") return false;
    if (token === "(") {
      const value = binary(0);
      if (tokens[pos++] !== ")") throw new SyntaxError(`Missing ")" in "${expression}"`);
      return value;
    }
    throw new SyntaxError(`Unexpected ${token === undefined ? "end" : `"${token}"`} in "${expression}"`);
  };

  const binary = (level) => {
    if (level === BINARY.length) return unary();
    let value = binary(level + 1);
    while (BINARY[level].includes(tokens[pos])) {
      const op = tokens[pos++];
      value = apply(op, value, binary(level + 1));
    }
    return value;
  };

  const value = binary(0);
  if (pos !== tokens.length) throw new SyntaxError(`Unexpected "${tokens[pos]}" in "${expression}"`);
  return value;
};
