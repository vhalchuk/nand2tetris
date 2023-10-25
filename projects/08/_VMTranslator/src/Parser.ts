import fs from "fs";
import {
  ArithmeticOperationType,
  Command,
  LogicalOperationType,
  PopSegment,
  Segment,
} from "./types";

export default class Parser {
  #lines: string[];
  #currentLineIndex: number;
  #currentCommand: Command | null;

  constructor(filePath: string) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    this.#lines = fileContent.split("\n");
    this.#currentLineIndex = 0;
    this.#currentCommand = null;
  }

  get currentCommand(): Command | null {
    return this.#currentCommand;
  }

  advance(): void {
    this.#currentCommand = null;

    while (this.hasMoreCommands()) {
      const currentLine = this.#lines[this.#currentLineIndex];
      const strippedLine = currentLine
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*.*\*\//gm, "")
        .trim();

      if (strippedLine.length === 0) {
        this.#currentLineIndex++;
        continue;
      }

      const lineParts = strippedLine.split(" ");

      if (lineParts[0] === "push") {
        this.#currentCommand = {
          commandType: "C_PUSH",
          segment: lineParts[1] as Segment,
          address: Number(lineParts[2]),
        };
      }

      if (lineParts[0] === "pop") {
        this.#currentCommand = {
          commandType: "C_POP",
          segment: lineParts[1] as PopSegment,
          address: Number(lineParts[2]),
        };
      }

      if (["add", "sub", "neg"].includes(lineParts[0])) {
        this.#currentCommand = {
          commandType: "C_ARITHMETIC",
          arithmeticOperationType: lineParts[0] as ArithmeticOperationType,
        };
      }

      if (["eq", "gt", "lt", "and", "or", "not"].includes(lineParts[0])) {
        this.#currentCommand = {
          commandType: "C_LOGICAL",
          logicalOperationType: lineParts[0] as LogicalOperationType,
        };
      }

      if (lineParts[0] === "label") {
        this.#currentCommand = {
          commandType: "C_LABEL",
          label: lineParts[1],
        };
      }

      if (lineParts[0] === "goto") {
        this.#currentCommand = {
          commandType: "C_GOTO",
          label: lineParts[1],
        };
      }

      if (lineParts[0] === "if-goto") {
        this.#currentCommand = {
          commandType: "C_IF_GOTO",
          label: lineParts[1],
        };
      }

      if (lineParts[0] === "call") {
        this.#currentCommand = {
          commandType: "C_CALL_FUNC",
          functionName: lineParts[1],
          argumentsCount: +lineParts[2],
        };
      }

      if (lineParts[0] === "function") {
        this.#currentCommand = {
          commandType: "C_DECLARE_FUNC",
          functionName: lineParts[1],
          localsCount: +lineParts[2],
        };
      }

      if (lineParts[0] === "return") {
        this.#currentCommand = {
          commandType: "C_RETURN",
        };
      }

      this.#currentLineIndex++;

      if (this.#currentCommand) {
        break;
      } else {
        throw new Error(`Could not parse command: "${strippedLine}"`);
      }
    }
  }

  hasMoreCommands(): boolean {
    return this.#currentLineIndex < this.#lines.length;
  }
}
