import {
  ICodeWriter,
  ICompilationEngine,
  ISymbolTable,
  ITokenizer,
  Token,
} from "./interfaces";
import {
  Command,
  KeyWord,
  keyWordConstants,
  Kind,
  kindToSegment,
  operators,
  opToCommand,
  Segment,
  TokenType,
} from "./enums";
import SymbolTable from "./SymbolTable";

export default class CompilationEngine implements ICompilationEngine {
  #className: string | null;

  #tokenizer: ITokenizer;

  #codeWriter: ICodeWriter;

  #classSymbolTable: ISymbolTable;

  #subroutineSymbolTable: ISymbolTable;

  #labelCounter = 0;

  constructor(tokenizer: ITokenizer, codeWriter: ICodeWriter) {
    this.#tokenizer = tokenizer;
    this.#codeWriter = codeWriter;
    this.#classSymbolTable = new SymbolTable();
    this.#subroutineSymbolTable = new SymbolTable();
    this.#className = null;
  }

  #assertToken(): Token {
    const currentToken = this.#tokenizer.currentToken;

    if (!currentToken) throw new Error("Token is not defined");

    return currentToken;
  }

  #assertClassName(): string {
    if (!this.#className) throw new Error("Class name is not defined");

    return this.#className;
  }

  compileClass() {
    this.#tokenizer.advance(); // null (initialize tokenizer)
    this.#tokenizer.advance(); // keyword class
    this.#className = this.#assertToken().value;
    this.#tokenizer.advance(); // identifier [ClassName]
    this.#tokenizer.advance(); // symbol {
    while (["static", "field"].includes(this.#assertToken().value)) {
      this.compileClassVarDec();
    }
    while (
      ["constructor", "function", "method"].includes(this.#assertToken().value)
    ) {
      this.compileSubroutine();
    }
    this.#tokenizer.advance(); // symbol }
    this.#codeWriter.close();
  }

  compileClassVarDec() {
    const varKind = this.#assertToken().value; // static|field
    this.#tokenizer.advance(); // keyword static|field
    const varType = this.#assertToken().value; // int|char|boolean|[className]
    if (this.#assertToken().type === "keyword") {
      this.#tokenizer.advance(); // keyword int|char|boolean
    } else {
      this.#tokenizer.advance(); // identifier [className]
    }
    this.#classSymbolTable.define({
      name: this.#assertToken().value,
      kind: varKind as Kind,
      type: varType,
    });
    this.#tokenizer.advance(); // identifier [varName]
    while (this.#assertToken().value === ",") {
      this.#tokenizer.advance(); // symbol ,
      this.#classSymbolTable.define({
        name: this.#assertToken().value,
        kind: varKind as Kind,
        type: varType,
      });
      this.#tokenizer.advance(); // identifier [varName]
    }
    this.#tokenizer.advance(); // symbol ;
  }

  compileSubroutine() {
    this.#subroutineSymbolTable.reset();
    const subroutineKind = this.#assertToken().value;
    this.#tokenizer.advance(); // keyword constructor|function|method
    const subroutineType = this.#assertToken().value;
    this.#tokenizer.advance(); // keyword void|int|char|boolean
    const subroutineName = this.#assertToken().value;
    this.#tokenizer.advance(); // identifier [subroutineName]
    this.#tokenizer.advance(); // symbol (
    if (subroutineKind === "method") {
      this.#subroutineSymbolTable.define({
        name: "this",
        kind: Kind.ARG,
        type: subroutineType,
      });
    }
    this.compileParameterList();
    this.#tokenizer.advance(); // symbol )
    this.compileSubroutineBody(subroutineName, subroutineKind);
  }

  compileParameterList(): number {
    if (this.#assertToken().value === ")") {
      return 0; // empty parameter list
    }

    const varType = this.#assertToken().value;

    if (this.#assertToken().type === "keyword") {
      this.#tokenizer.advance(); // keyword int|char|boolean
    } else if (this.#assertToken().type === "identifier") {
      this.#tokenizer.advance(); // identifier [className]
    }

    this.#subroutineSymbolTable.define({
      name: this.#assertToken().value,
      kind: Kind.ARG,
      type: varType,
    });
    this.#tokenizer.advance(); // identifier [varName]

    let nVars = 1;

    while (this.#assertToken().value === ",") {
      nVars++;
      this.#tokenizer.advance(); // symbol ,
      const varType = this.#assertToken().value;

      if (this.#assertToken().type === "keyword") {
        this.#tokenizer.advance(); // keyword int|char|boolean
      } else if (this.#assertToken().type === "identifier") {
        this.#tokenizer.advance(); // identifier [className]
      }

      this.#subroutineSymbolTable.define({
        name: this.#assertToken().value,
        kind: Kind.ARG,
        type: varType,
      });
      this.#tokenizer.advance(); // identifier [varName]
    }

    return nVars;
  }

  compileSubroutineBody(subroutineName: string, subroutineKind: string) {
    this.#tokenizer.advance(); // symbol {
    while (this.#assertToken().value === "var") {
      this.compileVarDec();
    }
    const varCount = this.#subroutineSymbolTable.varCount(Kind.VAR);
    this.#codeWriter.writeFunction(
      `${this.#assertClassName()}.${subroutineName}`,
      varCount,
    );
    const isConstructor = subroutineName === "new";
    if (isConstructor) {
      const nFields = this.#classSymbolTable.varCount(Kind.FIELD);
      this.#codeWriter.writePush(Segment.CONSTANT, nFields);
      this.#codeWriter.writeCall("Memory.alloc", 1);
      this.#codeWriter.writePop(Segment.POINTER, 0);
    }
    const isMethod = subroutineKind === "method";
    if (isMethod) {
      this.#codeWriter.writePush(Segment.ARGUMENT, 0);
      this.#codeWriter.writePop(Segment.POINTER, 0);
    }
    this.compileStatements();
    this.#tokenizer.advance(); // symbol }
  }

  compileVarDec() {
    this.#tokenizer.advance(); // keyword var
    const varType = this.#assertToken().value; // int|char|boolean|[className]
    this.#tokenizer.advance(); // keyword int|char|boolean|[className]
    const name = this.#assertToken().value;
    this.#subroutineSymbolTable.define({
      name,
      kind: Kind.VAR,
      type: varType,
    });
    this.#tokenizer.advance(); // identifier [varName]
    while (this.#assertToken().value === ",") {
      this.#tokenizer.advance(); // symbol ,
      this.#subroutineSymbolTable.define({
        name: this.#assertToken().value,
        kind: Kind.VAR,
        type: varType,
      });
      this.#tokenizer.advance(); // identifier [varName]
    }
    this.#tokenizer.advance(); // symbol ;
  }

  compileStatements() {
    const keywords = ["let", "if", "while", "do", "return"];

    while (keywords.includes(this.#assertToken().value)) {
      switch (this.#assertToken().value) {
        case "let":
          this.compileLet();
          break;
        case "if":
          this.compileIf();
          break;
        case "while":
          this.compileWhile();
          break;
        case "do":
          this.compileDo();
          break;
        case "return":
          this.compileReturn();
          break;
      }
    }
  }

  compileLet() {
    this.#tokenizer.advance(); // keyword let

    const varName = this.#assertToken().value;
    const kind =
      this.#subroutineSymbolTable.kindOf(varName) ??
      this.#classSymbolTable.kindOf(varName);
    const index =
      this.#subroutineSymbolTable.indexOf(varName) ??
      this.#classSymbolTable.indexOf(varName);
    const segment = kindToSegment[kind as Kind]!;

    this.#tokenizer.advance(); // identifier [varName]

    if (this.#assertToken().value === "[") {
      this.#tokenizer.advance(); // symbol [
      this.#codeWriter.writePush(segment, index!);
      this.compileExpression();
      this.#codeWriter.writeArithmetic(Command.ADD);
      this.#tokenizer.advance(); // symbol ]
      this.#tokenizer.advance(); // symbol =
      this.compileExpression();
      this.#codeWriter.writePop(Segment.TEMP, 0);
      this.#codeWriter.writePop(Segment.POINTER, 1);
      this.#codeWriter.writePush(Segment.TEMP, 0);
      this.#codeWriter.writePop(Segment.THAT, 0);
      this.#tokenizer.advance(); // symbol ;
    } else {
      this.#tokenizer.advance(); // symbol =
      this.compileExpression();
      this.#codeWriter.writePop(segment, index!);
      this.#tokenizer.advance(); // symbol ;
    }
  }

  compileIf() {
    const labelCounter = this.#labelCounter++;
    this.#tokenizer.advance(); // keyword if
    this.#tokenizer.advance(); // symbol (
    this.compileExpression();
    this.#codeWriter.writeArithmetic(Command.NOT);
    this.#codeWriter.writeIf(
      `${this.#assertClassName()}.${labelCounter}.ELSE_COND`,
    );
    this.#tokenizer.advance(); // symbol )
    this.#tokenizer.advance(); // symbol {
    this.compileStatements();
    this.#codeWriter.writeGoto(
      `${this.#assertClassName()}.${labelCounter}.IF_ELSE_END`,
    );
    this.#tokenizer.advance(); // symbol }
    this.#codeWriter.writeLabel(
      `${this.#assertClassName()}.${labelCounter}.ELSE_COND`,
    );
    if (this.#assertToken().value === "else") {
      this.#tokenizer.advance(); // keyword else
      this.#tokenizer.advance(); // symbol {
      this.compileStatements();
      this.#tokenizer.advance(); // symbol }
    }
    this.#codeWriter.writeLabel(
      `${this.#assertClassName()}.${labelCounter}.IF_ELSE_END`,
    );
  }

  compileWhile() {
    const labelCounter = this.#labelCounter++;
    this.#tokenizer.advance(); // keyword while
    this.#tokenizer.advance(); // symbol (
    this.#codeWriter.writeLabel(
      `${this.#assertClassName()}.${labelCounter}.START_LOOP`,
    );
    this.compileExpression();
    this.#codeWriter.writeArithmetic(Command.NOT);
    this.#codeWriter.writeIf(
      `${this.#assertClassName()}.${labelCounter}.END_LOOP`,
    );
    this.#tokenizer.advance(); // symbol )
    this.#tokenizer.advance(); // symbol {
    this.compileStatements();
    this.#codeWriter.writeGoto(
      `${this.#assertClassName()}.${labelCounter}.START_LOOP`,
    );
    this.#codeWriter.writeLabel(
      `${this.#assertClassName()}.${labelCounter}.END_LOOP`,
    );
    this.#tokenizer.advance(); // symbol }
  }

  compileDo() {
    this.#tokenizer.advance(); // keyword do
    this.compileExpression();
    this.#codeWriter.writePop(Segment.TEMP, 0);
    this.#tokenizer.advance(); // symbol ;
  }

  compileReturn() {
    this.#tokenizer.advance(); // keyword return
    if (this.#assertToken().value !== ";") {
      this.compileExpression();
    } else {
      this.#codeWriter.writePush(Segment.CONSTANT, 0);
    }
    this.#codeWriter.writeReturn();
    this.#tokenizer.advance(); // symbol ;
  }

  compileExpression() {
    this.compileTerm();
    if (operators.includes(this.#assertToken().value)) {
      const op = this.#assertToken().value;
      this.#tokenizer.advance(); // symbol {op}
      this.compileTerm();

      if (op === "*") {
        this.#codeWriter.writeCall("Math.multiply", 2);
      } else if (op === "/") {
        this.#codeWriter.writeCall("Math.divide", 2);
      } else {
        const command = opToCommand[op] as Command;
        this.#codeWriter.writeArithmetic(command);
      }
    }
  }

  compileTerm() {
    // integerConstant
    if (this.#assertToken().type === TokenType.IntConst) {
      const integerConstant = this.#assertToken().value;
      this.#tokenizer.advance(); // integerConstant [value]
      this.#codeWriter.writePush(Segment.CONSTANT, +integerConstant);
      return;
    }

    // stringConstant
    if (this.#assertToken().type === TokenType.StringConst) {
      const stringConstant = this.#assertToken().value;
      this.#tokenizer.advance(); // stringConstant [value]
      this.#codeWriter.writePush(Segment.CONSTANT, stringConstant.length);
      this.#codeWriter.writeCall("String.new", 1);
      for (let i = 0; i < stringConstant.length; i++) {
        this.#codeWriter.writePush(
          Segment.CONSTANT,
          stringConstant.charCodeAt(i),
        );
        this.#codeWriter.writeCall("String.appendChar", 2);
      }
      return;
    }

    // keywordConstant
    if (keyWordConstants.includes(this.#assertToken().value as KeyWord)) {
      this.#compileKeywordConstant();
      return;
    }

    const currentToken = this.#assertToken();
    const nextToken = this.#tokenizer.lookAhead()!;

    // varName
    if (
      currentToken.type === TokenType.Identifier &&
      nextToken.value !== "[" &&
      nextToken.value !== "." &&
      nextToken.value !== "("
    ) {
      const name = currentToken.value;
      const kind =
        this.#subroutineSymbolTable.kindOf(name) ??
        this.#classSymbolTable.kindOf(name);
      const index =
        this.#subroutineSymbolTable.indexOf(name) ??
        this.#classSymbolTable.indexOf(name);
      const segment = kindToSegment[kind as Kind]!;
      this.#codeWriter.writePush(segment, index!);
      this.#tokenizer.advance(); // identifier [varName]
      return;
    }

    // varName '[' expression ']'
    if (currentToken.type === TokenType.Identifier && nextToken.value === "[") {
      const varName = currentToken.value;
      const kind =
        this.#subroutineSymbolTable.kindOf(varName) ??
        this.#classSymbolTable.kindOf(varName);
      const index =
        this.#subroutineSymbolTable.indexOf(varName) ??
        this.#classSymbolTable.indexOf(varName);
      const segment = kindToSegment[kind as Kind]!;
      this.#codeWriter.writePush(segment, index!);

      this.#tokenizer.advance(); // identifier [varName]
      this.#tokenizer.advance(); // symbol [
      this.compileExpression();
      this.#tokenizer.advance(); // symbol ]

      this.#codeWriter.writeArithmetic(Command.ADD);
      this.#codeWriter.writePop(Segment.POINTER, 1);
      this.#codeWriter.writePush(Segment.THAT, 0);

      return;
    }

    // '(' expression ')'
    if (currentToken.value === "(") {
      this.#tokenizer.advance(); // symbol (
      this.compileExpression();
      this.#tokenizer.advance(); // symbol )
      return;
    }

    // unaryOp term
    if (["-", "~"].includes(currentToken.value)) {
      const unaryOp = currentToken.value;
      this.#tokenizer.advance(); // symbol -|~
      this.compileTerm();
      if (unaryOp === "-") {
        this.#codeWriter.writeArithmetic(Command.NEG);
      } else if (unaryOp === "~") {
        this.#codeWriter.writeArithmetic(Command.NOT);
      }
      return;
    }

    // subroutineCall

    // subroutineName '(' expressionList ')'
    if (nextToken.value === "(") {
      const subroutineName = currentToken.value;
      this.#tokenizer.advance(); // identifier [subroutine]
      this.#tokenizer.advance(); // symbol (
      this.#codeWriter.writePush(Segment.POINTER, 0);
      const nArgs = this.compileExpressionList();
      this.#tokenizer.advance(); // symbol )
      this.#codeWriter.writeCall(
        `${this.#assertClassName()}.${subroutineName}`,
        nArgs + 1,
      );
      return;
    }

    // className '.' subroutineName '(' expressionList ')'
    if (currentToken.value[0] === currentToken.value[0].toUpperCase()) {
      const className = currentToken.value;
      this.#tokenizer.advance(); // identifier [className]
      this.#tokenizer.advance(); // symbol .
      const subroutineName = this.#assertToken().value;
      this.#tokenizer.advance(); // identifier [subroutine]
      this.#tokenizer.advance(); // symbol (
      const nArgs = this.compileExpressionList();
      this.#tokenizer.advance(); // symbol )
      this.#codeWriter.writeCall(`${className}.${subroutineName}`, nArgs);
      return;
    }

    // varName '.' subroutineName '(' expressionList ')'
    const varName = currentToken.value;
    const className =
      this.#subroutineSymbolTable.typeOf(varName) ??
      this.#classSymbolTable.typeOf(varName);
    this.#tokenizer.advance(); // identifier [className]
    this.#tokenizer.advance(); // symbol .
    const subroutineName = this.#assertToken().value;
    this.#tokenizer.advance(); // identifier [subroutine]
    this.#tokenizer.advance(); // symbol (
    const kind =
      this.#subroutineSymbolTable.kindOf(varName) ??
      this.#classSymbolTable.kindOf(varName);
    const index =
      this.#subroutineSymbolTable.indexOf(varName) ??
      this.#classSymbolTable.indexOf(varName);
    const segment = kindToSegment[kind as Kind]!;
    this.#codeWriter.writePush(segment, index!);
    const nArgs = this.compileExpressionList();
    this.#tokenizer.advance(); // symbol )
    this.#codeWriter.writeCall(`${className}.${subroutineName}`, nArgs + 1);
  }

  #compileKeywordConstant() {
    const keywordConstant = this.#assertToken().value;

    if (keywordConstant === KeyWord.True) {
      this.#codeWriter.writePush(Segment.CONSTANT, 0);
      this.#codeWriter.writeArithmetic(Command.NOT);
    } else if (keywordConstant === KeyWord.False) {
      this.#codeWriter.writePush(Segment.CONSTANT, 0);
    } else if (keywordConstant === KeyWord.Null) {
      this.#codeWriter.writePush(Segment.CONSTANT, 0);
    } else if (keywordConstant === KeyWord.This) {
      this.#codeWriter.writePush(Segment.POINTER, 0);
    }
    this.#tokenizer.advance(); // keyword {keywordConstant}
  }

  compileExpressionList(): number {
    let count = 0;

    if (this.#assertToken().value !== ")") {
      this.compileExpression();

      count++;

      while (this.#assertToken().value === ",") {
        count++;
        this.#tokenizer.advance(); // symbol ,
        this.compileExpression();
      }
    }

    return count;
  }
}
