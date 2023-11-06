import { TokenType } from "./enums";

export interface ITokenizer {
  hasMoreTokens(): boolean;

  advance(): void;

  currentToken: Token | null;
}

export interface ICompilationEngine {
  compileClass(): void;

  compileClassVarDec(): void;

  compileSubroutine(): void;

  compileParameterList(): void;

  compileSubroutineBody(): void;

  compileVarDec(): void;

  compileStatements(): void;

  compileLet(): void;

  compileIf(): void;

  compileWhile(): void;

  compileDo(): void;

  compileReturn(): void;

  compileExpression(): void;

  compileTerm(): void;

  compileExpressionList(): void;
}

export interface Token {
  type: TokenType;
  value: string;
}
