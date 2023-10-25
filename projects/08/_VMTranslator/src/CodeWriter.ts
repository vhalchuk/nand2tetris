import fs from "fs";
import {
  ArithmeticCommand,
  CallFuncCommand,
  Command,
  DeclareFuncCommand,
  GotoCommand,
  IfGotoCommand,
  LabelCommand,
  LogicalCommand,
  PopCommand,
  PushCommand,
} from "./types";

export default class CodeWriter {
  readonly #TEMP_SEGMENT_BASE_ADDRESS = 5;
  #logicalOperationIndex = 0;
  #writeStream: fs.WriteStream;
  #currentClass = "Main";
  #returnIndex = 0;
  #currentFunction = "";

  constructor(writePath: string) {
    this.#writeStream = fs.createWriteStream(writePath, { flags: "a" });
  }

  close() {
    this.#writeStream.close();
  }

  setClassName(className: string) {
    this.#currentClass = className;
  }

  writeBootstrapCode() {
    const bootstrapCode = [
      "// bootstrap code",
      "@256",
      "D=A",
      "@SP",
      "M=D",
    ].join("\n");
    const callInitCode = this.#handleCallFunc({
      commandType: "C_CALL_FUNC",
      functionName: "Sys.init",
      argumentsCount: 0,
    }).join("\n");
    const content = bootstrapCode + "\n" + callInitCode + "\n\n";
    this.#writeStream.write(content);
  }

  writeCommand(command: Command) {
    let lines: string[];

    switch (command.commandType) {
      case "C_PUSH":
        lines = this.#handlePush(command);
        break;
      case "C_POP":
        lines = this.#handlePop(command);
        break;
      case "C_ARITHMETIC":
        lines = this.#handleArithmetic(command);
        break;
      case "C_LOGICAL":
        lines = this.#handleLogical(command);
        break;
      case "C_LABEL":
        lines = this.#handleLabel(command);
        break;
      case "C_GOTO":
        lines = this.#handleGotoLabel(command);
        break;
      case "C_IF_GOTO":
        lines = this.#handleIfGotoLabel(command);
        break;
      case "C_CALL_FUNC":
        lines = this.#handleCallFunc(command);
        break;
      case "C_DECLARE_FUNC":
        lines = this.#handleDeclareFunc(command);
        break;
      case "C_RETURN":
        lines = this.#handleReturnCommand();
        break;
      default:
        throw new Error(
          // @ts-ignore
          `Command type is not recognized: ${command.commandType}`,
        );
    }

    const content = lines.join("\n") + "\n\n";
    this.#writeStream.write(content);
  }

  #handlePush(command: PushCommand): string[] {
    if (command.segment === "constant") {
      return [
        `// push ${command.segment} ${command.address}`,
        `@${command.address}`,
        "D=A",
        "@SP",
        "A=M",
        "M=D",
        "@SP",
        "M=M+1",
      ];
    } else if (command.segment === "static") {
      return [
        `// push ${command.segment} ${command.address}`,
        `@${this.#currentClass}.${command.address}`,
        "D=M",
        "@SP",
        "A=M",
        "M=D",
        "@SP",
        "M=M+1",
      ];
    } else if (command.segment === "temp") {
      const addr = this.#TEMP_SEGMENT_BASE_ADDRESS + command.address;

      if (addr > 12) throw new Error(`"temp" segment overflow`);

      return [
        `// push ${command.segment} ${command.address}`,
        `@R${addr}`,
        "D=M",
        "@SP",
        "A=M",
        "M=D",
        "@SP",
        "M=M+1",
      ];
    } else if (command.segment === "pointer") {
      if (command.address > 1)
        throw new Error(`Invalid "pointer" segment address`);

      const symbol = command.address === 0 ? "THIS" : "THAT";

      return [
        `// push ${command.segment} ${command.address}`,
        `@${symbol}`,
        "D=M",
        "@SP",
        "A=M",
        "M=D",
        "@SP",
        "M=M+1",
      ];
    } else if (
      ["local", "argument", "this", "that"].includes(command.segment)
    ) {
      const symbolsMap = {
        local: "LCL",
        argument: "ARG",
        this: "THIS",
        that: "THAT",
      };

      const symbol = symbolsMap[command.segment];

      return [
        `// push ${command.segment} ${command.address}`,
        `@${command.address} // offset`,
        "D=A",
        `@${symbol}`,
        "A=M+D",
        "D=M",
        "@SP",
        "A=M",
        "M=D",
        "@SP",
        "M=M+1",
      ];
    } else {
      throw new Error(`Segment is not recognized: ${command.segment}`);
    }
  }

  #handlePop(command: PopCommand): string[] {
    if (command.segment === "static") {
      return [
        `// pop ${command.segment} ${command.address}`,
        "@SP",
        "AM=M-1",
        "D=M",
        `@${this.#currentClass}.${command.address}`,
        "M=D",
      ];
    } else if (command.segment === "temp") {
      const addr = this.#TEMP_SEGMENT_BASE_ADDRESS + command.address;

      if (addr > 12) throw new Error(`"temp" segment overflow`);

      return [
        `// pop ${command.segment} ${command.address}`,
        "@SP",
        "AM=M-1",
        "D=M",
        `@R${addr}`,
        "M=D",
      ];
    } else if (command.segment === "pointer") {
      if (command.address > 1)
        throw new Error(`Invalid "pointer" segment address`);

      const symbol = command.address === 0 ? "THIS" : "THAT";

      return [
        `// pop ${command.segment} ${command.address}`,
        "@SP",
        "AM=M-1",
        "D=M",
        `@${symbol}`,
        "M=D",
      ];
    } else if (
      ["local", "argument", "this", "that"].includes(command.segment)
    ) {
      const symbolsMap = {
        local: "LCL",
        argument: "ARG",
        this: "THIS",
        that: "THAT",
      };
      const symbol = symbolsMap[command.segment];

      return [
        `// pop ${command.segment} ${command.address}`,
        `@${command.address}`,
        "D=A",
        `@${symbol}`,
        "D=M+D",
        "@addr",
        "M=D",
        "@SP",
        "AM=M-1",
        "D=M",
        "@addr",
        "A=M",
        "M=D",
      ];
    } else {
      throw new Error(`Segment is not recognized: ${command.segment}`);
    }
  }

  #handleArithmetic(command: ArithmeticCommand): string[] {
    if (command.arithmeticOperationType === "add") {
      return [
        "// add (x, y)",
        "@SP",
        "AM=M-1",
        "D=M // Load y into D register",
        "@SP",
        "AM=M-1",
        "M=M+D // Compute x + y",
        "@SP",
        "M=M+1 // Advance stack pointer",
      ];
    } else if (command.arithmeticOperationType === "sub") {
      return [
        "// sub (x, y)",
        "@SP",
        "AM=M-1",
        "D=M // Load y into D register",
        "@SP",
        "AM=M-1",
        "M=M-D // Compute x - y",
        "@SP",
        "M=M+1 // Advance stack pointer",
      ];
    } else if (command.arithmeticOperationType === "neg") {
      return [
        "// neg",
        "@SP",
        "AM=M-1",
        "M=-M",
        "@SP",
        "M=M+1 // Advance stack pointer",
      ];
    } else {
      throw new Error(
        `Arithmetic operation type is not recognized: ${command.arithmeticOperationType}`,
      );
    }
  }

  #handleLogical(command: LogicalCommand): string[] {
    if (["eq", "gt", "lt"].includes(command.logicalOperationType)) {
      const jumpsMap = {
        eq: "JEQ",
        gt: "JGT",
        lt: "JLT",
      };
      const jump = jumpsMap[command.logicalOperationType as "eq" | "gt" | "lt"];

      this.#logicalOperationIndex++;

      return [
        `// ${command.logicalOperationType} (x,y)`,
        "@SP",
        "AM=M-1 // Point to y",
        "D=M // Load y into D register",
        "@SP",
        "AM=M-1 // Point to x",
        "D=M-D // Load result of 'x - y' into D register",
        `@${this.#currentClass}$logicalOperationJump.${
          this.#logicalOperationIndex
        }`,
        `D;${jump} // Jump if condition is met`,
        "@SP",
        "A=M // Point to the top of the stack",
        "M=0   // Set to false (0)",
        `@${this.#currentClass}$logicalOperationContinue_${
          this.#logicalOperationIndex
        }`,
        "0;JMP // Jump to CONTINUE",
        `(${this.#currentClass}$logicalOperationJump.${
          this.#logicalOperationIndex
        })`,
        "@SP",
        "A=M // Point to the top of the stack",
        "M=-1 // Set to true (-1)",
        `(${this.#currentClass}$logicalOperationContinue_${
          this.#logicalOperationIndex
        })`,
        "@SP",
        "M=M+1 // Advance stack pointer",
      ];
    } else if (["and", "or"].includes(command.logicalOperationType)) {
      const computationsMap = {
        and: "D&M",
        or: "D|M",
      };
      const comp =
        computationsMap[command.logicalOperationType as "and" | "or"];

      return [
        `// ${command.logicalOperationType} (x,y)`,
        "@SP",
        "AM=M-1 // Point to y",
        "D=M // Load y into D register",
        "@SP",
        "AM=M-1 // Point to x",
        `D=${comp} // Compute`,
        "@SP",
        "A=M // Point to the top of the stack",
        "M=D // Save computation result to the top of the stack",
        "@SP",
        "M=M+1 // Advance stack pointer",
      ];
    } else if (command.logicalOperationType === "not") {
      return [
        "// not (x)",
        "@SP",
        "AM=M-1 // Point to x",
        "D=M // Load x into D register",
        "@SP",
        "A=M // Point to the top of the stack",
        "M=!D // Save computation result to the top of the stack",
        "@SP",
        "M=M+1 // Advance stack pointer",
      ];
    } else {
      throw new Error(
        `Logical operation type is not recognized: ${command.logicalOperationType}`,
      );
    }
  }

  #handleLabel(command: LabelCommand) {
    return [
      `// label ${command.label}`,
      `(${this.#currentFunction}$${command.label})`,
    ];
  }

  #handleGotoLabel(command: GotoCommand) {
    return [
      `// goto ${command.label}`,
      `@${this.#currentFunction}$${command.label}`,
      `0;JMP`,
    ];
  }

  #handleIfGotoLabel(command: IfGotoCommand) {
    return [
      `// if-goto ${command.label}`,
      "@SP",
      "AM=M-1 // Pop condition",
      "D=M // Load condition into D register",
      `@${this.#currentFunction}$${command.label}`,
      `D;JNE`,
    ];
  }

  #handleCallFunc(command: CallFuncCommand) {
    this.#returnIndex++;

    return [
      `// call ${command.functionName} ${command.argumentsCount}`,
      "// saves return label ROM address",
      `@${this.#currentClass}$ret.${this.#returnIndex}`,
      "D=A",
      "@SP",
      "A=M",
      "M=D",
      "@SP",
      "M=M+1",
      "// saves the caller's LCL",
      "@LCL",
      "D=M",
      "@SP",
      "A=M",
      "M=D",
      "@SP",
      "M=M+1",
      "// saves the caller's ARG",
      "@ARG",
      "D=M",
      "@SP",
      "A=M",
      "M=D",
      "@SP",
      "M=M+1",
      "// saves the caller's THIS",
      "@THIS",
      "D=M",
      "@SP",
      "A=M",
      "M=D",
      "@SP",
      "M=M+1",
      "// saves the caller's THAT",
      "@THAT",
      "D=M",
      "@SP",
      "A=M",
      "M=D",
      "@SP",
      "M=M+1",
      "// reposition ARG",
      "@5",
      "D=A",
      `@${command.argumentsCount} // number of arguments`,
      "D=D+A",
      "@SP",
      "D=M-D",
      "@ARG",
      "M=D",
      "// reposition LCL",
      "@SP",
      "D=M",
      "@LCL",
      "M=D",
      "// transfer control to the callee",
      `@${command.functionName}`,
      "0;JMP",
      "// inject this label into the code",
      `(${this.#currentClass}$ret.${this.#returnIndex})`,
    ];
  }

  #handleDeclareFunc(command: DeclareFuncCommand) {
    this.#currentFunction = command.functionName;

    const lines = [
      `// func ${command.functionName} ${command.localsCount}`,
      `(${command.functionName})`,
    ];

    for (let i = 0; i < command.localsCount; i++) {
      lines.push(
        ...[
          `// initializing local variable with index ${i}`,
          "@SP",
          "A=M",
          "M=0",
          "@SP",
          "M=M+1",
        ],
      );
    }

    return lines;
  }

  #handleReturnCommand() {
    return [
      "// return",
      "// gets the address at the frame’s end",
      "@LCL",
      "D=M",
      "@13 // endFrame",
      "M=D",
      "// gets the return address",
      "@13 // endFrame",
      "D=M",
      "@5 // constant",
      "D=D-A // endFrame - 5",
      "A=D",
      "D=M",
      "@14 // retAddr",
      "M=D",
      "// repositions the return value for the caller",
      "@SP",
      "AM=M-1",
      "D=M",
      "@ARG",
      "A=M",
      "M=D",
      "// repositions SP",
      "@ARG",
      "D=M+1",
      "@SP",
      "M=D",
      "// restores THAT",
      "@1 // constant",
      "D=A",
      "@13 // endFrame",
      "D=M-D // endFrame - 1",
      "A=D",
      "D=M",
      "@THAT",
      "M=D",
      "// restores THIS",
      "@2",
      "D=A",
      "@13 // endFrame",
      "D=M-D // endFrame - 2",
      "A=D",
      "D=M",
      "@THIS",
      "M=D",
      "// restores ARG",
      "@3",
      "D=A",
      "@13 // endFrame",
      "D=M-D // endFrame - 3",
      "A=D",
      "D=M",
      "@ARG",
      "M=D",
      "// restores LCL",
      "@4",
      "D=A",
      "@13 // endFrame",
      "D=M-D // endFrame - 4",
      "A=D",
      "D=M",
      "@LCL",
      "M=D",
      "// jumps to the return address",
      `@14 // retAddr`,
      "A=M",
      `0;JMP`,
    ];
  }
}
