import { ICompilationEngine, ITokenizer } from "./interfaces";
import fs from "fs";
import { escapedOperators, KeyWord, keyWords, TokenType } from "./enums";

export default class CompilationEngine implements ICompilationEngine {
  #tokenizer: ITokenizer;

  #writeStream: fs.WriteStream;

  #intendation: number;

  constructor(tokenizer: ITokenizer, writeStream: fs.WriteStream) {
    this.#tokenizer = tokenizer;
    this.#writeStream = writeStream;
    this.#intendation = 0;
  }

  #invariant(condition: unknown): asserts condition {
    if (condition) return;

    throw new Error("Invariant failed");
  }

  #processTerminal(type?: string, value?: string) {
    this.#invariant(this.#tokenizer.currentToken);

    if (
      (type && this.#tokenizer.currentToken.type !== type) ||
      (value && this.#tokenizer.currentToken.value !== value)
    ) {
      this.#writeStream.write("ERROR\n");
      // this.#writeStream.close();
      // throw new Error("Compilation error");
      return;
    }

    this.#printXml(
      this.#tokenizer.currentToken.type,
      this.#tokenizer.currentToken.value,
    );
    this.#tokenizer.advance();
  }

  #printXml(tag: string, value: string) {
    this.#print(`<${tag}> ${value} </${tag}>`);
  }

  #print(value: string) {
    const space = new Array(this.#intendation * 2).fill(" ").join("");

    this.#writeStream.write(`${space}${value}\n`);
  }

  compileClass() {
    this.#print(`<class>`);
    this.#intendation++;
    this.#processTerminal("keyword", "class");
    this.#processTerminal("identifier"); // class name
    this.#processTerminal("symbol", "{");
    while (
      ["static", "field"].includes(this.#tokenizer.currentToken?.value || "")
    ) {
      this.compileClassVarDec();
    }
    while (
      ["constructor", "function", "method"].includes(
        this.#tokenizer.currentToken?.value || "",
      )
    ) {
      this.compileSubroutine();
    }
    this.#processTerminal("symbol", "}");
    this.#intendation--;
    this.#print(`</class>`);
  }

  compileClassVarDec() {
    this.#print(`<classVarDec>`);
    this.#intendation++;
    this.#processTerminal("keyword");
    if (this.#tokenizer.currentToken?.type === "keyword") {
      this.#processTerminal("keyword");
    } else {
      this.#processTerminal("identifier");
    }
    this.#processTerminal("identifier");
    while (this.#tokenizer.currentToken?.value === ",") {
      this.#processTerminal("symbol", ",");
      this.#processTerminal("identifier");
    }
    this.#processTerminal("symbol", ";");
    this.#intendation--;
    this.#print(`</classVarDec>`);
  }

  compileSubroutine() {
    this.#print(`<subroutineDec>`);
    this.#intendation++;
    this.#processTerminal("keyword");
    if (this.#tokenizer.currentToken?.type === "keyword") {
      this.#processTerminal("keyword");
    } else {
      this.#processTerminal("identifier");
    }
    this.#processTerminal("identifier");
    this.#processTerminal("symbol", "(");
    this.compileParameterList();
    this.#processTerminal("symbol", ")");
    this.compileSubroutineBody();
    this.#intendation--;
    this.#print(`</subroutineDec>`);
  }

  compileParameterList() {
    this.#print(`<parameterList>`);
    this.#intendation++;
    if (this.#tokenizer.currentToken?.type === "keyword") {
      this.#processTerminal("keyword");
      this.#processTerminal("identifier");
    }
    while (this.#tokenizer.currentToken?.value === ",") {
      this.#processTerminal("symbol", ",");
      this.#processTerminal("keyword");
      this.#processTerminal("identifier");
    }
    this.#intendation--;
    this.#print(`</parameterList>`);
  }

  compileSubroutineBody() {
    this.#print(`<subroutineBody>`);
    this.#intendation++;
    this.#processTerminal("symbol", "{");
    while (this.#tokenizer.currentToken?.value === "var") {
      this.compileVarDec();
    }
    this.compileStatements();
    this.#processTerminal("symbol", "}");
    this.#intendation--;
    this.#print(`</subroutineBody>`);
  }

  compileVarDec() {
    this.#print(`<varDec>`);
    this.#intendation++;
    this.#processTerminal("keyword", "var");
    if (this.#tokenizer.currentToken?.type === "keyword") {
      this.#processTerminal("keyword"); // primitive type
    } else {
      this.#processTerminal("identifier"); // class type
    }
    this.#processTerminal("identifier"); // var name
    while (this.#tokenizer.currentToken?.value === ",") {
      this.#processTerminal("symbol", ",");
      this.#processTerminal("identifier"); // var name
    }
    this.#processTerminal("symbol", ";");
    this.#intendation--;
    this.#print(`</varDec>`);
  }

  compileStatements() {
    this.#print(`<statements>`);
    this.#intendation++;
    while (
      ["let", "if", "while", "do", "return"].includes(
        this.#tokenizer.currentToken?.value || "",
      )
    ) {
      if (this.#tokenizer.currentToken?.value === "let") {
        this.compileLet();
      }

      if (this.#tokenizer.currentToken?.value === "if") {
        this.compileIf();
      }

      if (this.#tokenizer.currentToken?.value === "while") {
        this.compileWhile();
      }

      if (this.#tokenizer.currentToken?.value === "do") {
        this.compileDo();
      }

      if (this.#tokenizer.currentToken?.value === "return") {
        this.compileReturn();
      }
    }
    this.#intendation--;
    this.#print(`</statements>`);
  }

  compileLet() {
    this.#print(`<letStatement>`);
    this.#intendation++;
    this.#processTerminal("keyword", "let");
    this.#processTerminal("identifier");
    if (this.#tokenizer.currentToken?.value === "[") {
      this.#processTerminal("symbol", "[");
      this.compileExpression();
      this.#processTerminal("symbol", "]");
    }
    this.#processTerminal("symbol", "=");
    this.compileExpression();
    this.#processTerminal("symbol", ";");
    this.#intendation--;
    this.#print(`</letStatement>`);
  }

  compileIf() {
    this.#print(`<ifStatement>`);
    this.#intendation++;
    this.#processTerminal("keyword", "if");
    this.#processTerminal("symbol", "(");
    this.compileExpression();
    this.#processTerminal("symbol", ")");
    this.#processTerminal("symbol", "{");
    this.compileStatements();
    this.#processTerminal("symbol", "}");
    if (this.#tokenizer.currentToken?.value === "else") {
      this.#processTerminal("keyword", "else");
      this.#processTerminal("symbol", "{");
      this.compileStatements();
      this.#processTerminal("symbol", "}");
    }
    this.#intendation--;
    this.#print(`</ifStatement>`);
  }

  compileWhile() {
    this.#print(`<whileStatement>`);
    this.#intendation++;
    this.#processTerminal("keyword", "while");
    this.#processTerminal("symbol", "(");
    this.compileExpression();
    this.#processTerminal("symbol", ")");
    this.#processTerminal("symbol", "{");
    this.compileStatements();
    this.#processTerminal("symbol", "}");
    this.#intendation--;
    this.#print(`</whileStatement>`);
  }

  compileDo() {
    this.#print(`<doStatement>`);
    this.#intendation++;
    this.#processTerminal("keyword", "do");
    this.#processTerminal("identifier");
    if (this.#tokenizer.currentToken?.value === ".") {
      this.#processTerminal("symbol", ".");
      this.#processTerminal("identifier");
    }
    this.#processTerminal("symbol", "(");
    this.compileExpressionList();
    this.#processTerminal("symbol", ")");
    this.#processTerminal("symbol", ";");
    this.#intendation--;
    this.#print(`</doStatement>`);
  }

  compileReturn() {
    this.#print(`<returnStatement>`);
    this.#intendation++;
    this.#processTerminal("keyword", "return");
    if (this.#tokenizer.currentToken?.value !== ";") {
      this.compileExpression();
    }
    this.#processTerminal("symbol", ";");
    this.#intendation--;
    this.#print(`</returnStatement>`);
  }

  compileExpression() {
    this.#print(`<expression>`);
    this.#intendation++;
    this.compileTerm();
    if (escapedOperators.includes(this.#tokenizer.currentToken?.value || "")) {
      this.#processTerminal("symbol");
      this.compileTerm();
    }
    this.#intendation--;
    this.#print(`</expression>`);
  }

  compileTerm() {
    this.#print(`<term>`);
    this.#intendation++;

    this.#invariant(this.#tokenizer.currentToken);

    if (this.#tokenizer.currentToken.type === TokenType.IntConst) {
      this.#processTerminal();
    } else if (this.#tokenizer.currentToken.type === TokenType.StringConst) {
      this.#processTerminal();
    } else if (
      keyWords.includes(this.#tokenizer.currentToken.value as KeyWord)
    ) {
      this.#processTerminal();
    } else if (this.#tokenizer.currentToken.type === TokenType.Identifier) {
      this.#processTerminal(); // varName or subroutineName or classNae

      if (this.#tokenizer.currentToken.value === "[") {
        this.#processTerminal("symbol", "[");
        this.compileExpression();
        this.#processTerminal("symbol", "]");
      }

      if (this.#tokenizer.currentToken.value === "(") {
        this.#processTerminal("symbol", "(");
        this.compileExpressionList();
        this.#processTerminal("symbol", ")");
      }

      if (this.#tokenizer.currentToken.value === ".") {
        this.#processTerminal("symbol", ".");
        this.#processTerminal(); // subroutineName
        this.#processTerminal("symbol", "(");
        this.compileExpressionList();
        this.#processTerminal("symbol", ")");
      }
    } else if (this.#tokenizer.currentToken.value === "(") {
      this.#processTerminal("symbol", "(");
      this.compileExpression();
      this.#processTerminal("symbol", ")");
    } else if (["-", "~"].includes(this.#tokenizer.currentToken.value)) {
      this.#processTerminal("symbol");
      this.compileTerm();
    }

    this.#intendation--;
    this.#print(`</term>`);
  }

  compileExpressionList() {
    this.#print(`<expressionList>`);
    this.#intendation++;

    if (this.#tokenizer.currentToken?.value !== ")") {
      this.compileExpression();

      while (this.#tokenizer.currentToken?.value === ",") {
        this.#processTerminal("symbol", ",");
        this.compileExpression();
      }
    }

    this.#intendation--;
    this.#print(`</expressionList>`);
  }
}
