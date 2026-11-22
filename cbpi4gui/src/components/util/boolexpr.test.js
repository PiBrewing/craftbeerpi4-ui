import { describe, expect, it } from "vitest";
import { evalBoolExpression } from "./boolexpr";

describe("evalBoolExpression", () => {
  it.each([
    ["true", true],
    ["false", false],
    ["!true", false],
    ["!!true", true],
    ["true && false", false],
    ["true || false", true],
    ["false || true && false", false],
    ["(false || true) && true", true],
    ["!(true && false)", true],
    ["true&&!false", true],
    ["true & false", false],
    ["true | false", true],
    ["true ^ true", false],
    ["true == false", false],
    ["true != false", true],
    ["true === true", true],
    ["false !== false", false],
    ["  true  ", true],
  ])("%s -> %s", (expression, expected) => {
    expect(evalBoolExpression(expression)).toBe(expected);
  });

  it.each([
    "",
    "true &&",
    "(true",
    "true)",
    "true false",
    '"Pump" && true',
    "alert(1)",
    "1 && true",
    "window.location",
  ])("rejects %j", (expression) => {
    expect(() => evalBoolExpression(expression)).toThrow(SyntaxError);
  });
});
