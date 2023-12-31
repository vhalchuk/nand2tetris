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

export const escapedOperators = [
  "&amp;",
  "&lt;",
  "&gt;",
  "+",
  "-",
  "*",
  "/",
  "|",
  "=",
];

export const enum TokenType {
  Keyword = "keyword",
  Symbol = "symbol",
  Identifier = "identifier",
  IntConst = "integerConstant",
  StringConst = "stringConstant",
}
