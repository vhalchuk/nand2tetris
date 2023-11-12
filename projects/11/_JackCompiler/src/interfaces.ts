import { Command, Kind, Segment, TokenType } from "./enums";

export interface ITokenizer {
  hasMoreTokens(): boolean;

  advance(): void;

  lookAhead(): Token | null;

  currentToken: Token | null;
}

export interface ICompilationEngine {
  compileClass(): void;

  compileClassVarDec(): void;

  compileSubroutine(): void;

  compileParameterList(): number;

  compileSubroutineBody(subroutineName: string, subroutineKind: string): void;

  compileVarDec(): void;

  compileStatements(): void;

  compileLet(): void;

  compileIf(): void;

  compileWhile(): void;

  compileDo(): void;

  compileReturn(): void;

  compileExpression(): void;

  compileTerm(): void;

  compileExpressionList(): number;
}

export interface ISymbolTable {
  reset(): void;

  define(entry: SymbolData): void;

  varCount(kind: Kind): number;

  kindOf(name: string): Kind | undefined;

  typeOf(name: string): string | undefined;

  indexOf(name: string): number | undefined;
}

export interface ICodeWriter {
  writePush(segment: Segment, index: number): void;

  writePop(segment: Segment, index: number): void;

  writeArithmetic(command: Command): void;

  writeLabel(label: string): void;

  writeGoto(label: string): void;

  writeIf(label: string): void;

  writeCall(name: string, nArgs: number): void;

  writeFunction(name: string, nVars: number): void;

  writeReturn(): void;

  close(): void;
}

export interface SymbolData {
  name: string;
  type: string;
  kind: Kind;
}

export interface SymbolTableEntry extends SymbolData {
  index: number;
}

export interface Token {
  type: TokenType;
  value: string;
}
