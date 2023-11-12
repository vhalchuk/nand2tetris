export const enum KeyWord {
  Class = "class",
  Method = "method",
  Function = "function",
  Constructor = "constructor",
  Int = "int",
  Boolean = "boolean",
  Char = "char",
  Void = "void",
  Var = "var",
  Static = "static",
  Field = "field",
  Let = "let",
  Do = "do",
  If = "if",
  Else = "else",
  While = "while",
  Return = "return",
  True = "true",
  False = "false",
  Null = "null",
  This = "this",
}

export const keyWords = [
  KeyWord.Class,
  KeyWord.Method,
  KeyWord.Function,
  KeyWord.Constructor,
  KeyWord.Int,
  KeyWord.Boolean,
  KeyWord.Char,
  KeyWord.Void,
  KeyWord.Var,
  KeyWord.Static,
  KeyWord.Field,
  KeyWord.Let,
  KeyWord.Do,
  KeyWord.If,
  KeyWord.Else,
  KeyWord.While,
  KeyWord.Return,
  KeyWord.True,
  KeyWord.False,
  KeyWord.Null,
  KeyWord.This,
];

export const keyWordConstants = [
  KeyWord.True,
  KeyWord.False,
  KeyWord.Null,
  KeyWord.This,
];

export const symbols = [
  "{",
  "}",
  "(",
  ")",
  "[",
  "]",
  ".",
  ",",
  ";",
  "+",
  "-",
  "*",
  "/",
  "&",
  "|",
  "<",
  ">",
  "=",
  "~",
];

export const operators = ["&", "<", ">", "+", "-", "*", "/", "|", "="];

export const enum TokenType {
  Keyword = "keyword",
  Symbol = "symbol",
  Identifier = "identifier",
  IntConst = "integerConstant",
  StringConst = "stringConstant",
}

export const enum Kind {
  STATIC = "static",
  FIELD = "field",
  ARG = "arg",
  VAR = "var",
}

export const enum Segment {
  CONSTANT = "constant",
  ARGUMENT = "argument",
  LOCAL = "local",
  STATIC = "static",
  THIS = "this",
  THAT = "that",
  POINTER = "pointer",
  TEMP = "temp",
}

export const enum Command {
  ADD = "add",
  SUB = "sub",
  NEG = "neg",
  EQ = "eq",
  GT = "gt",
  LT = "lt",
  AND = "and",
  OR = "or",
  NOT = "not",
}

export const opToCommand: Record<string, string> = {
  "&": Command.AND,
  "<": Command.LT,
  ">": Command.GT,
  "+": Command.ADD,
  "-": Command.SUB,
  "*": "Math.multiply",
  "/": "Math.divide",
  "|": Command.OR,
  "=": Command.EQ,
};

export const kindToSegment: Record<Kind, Segment> = {
  [Kind.VAR]: Segment.LOCAL,
  [Kind.ARG]: Segment.ARGUMENT,
  [Kind.FIELD]: Segment.THIS,
  [Kind.STATIC]: Segment.STATIC,
};
