const fs = require('fs');

/**
 * @typedef {import("./interfaces").Command} Command
 */

class CodeWriter {
    /** @type string */
    #filePath;

    #TEMP_SEGMENT_BASE_ADDRESS = 5;

    #labelCounter = 0;

    /**
     * @param filePath string
     */
    constructor(filePath) {
        this.#filePath = filePath
    }

    /**
     * @param command Command
     */
    write(command) {
        /** @type {string[]} */
        let lines;

        if (command.commandType === "C_PUSH") {
            if (command.segment === "constant") {
                lines = [
                    `// push ${command.segment} ${command.address}`,
                    `@${command.address}`,
                    "D=A",
                    "@SP",
                    "A=M",
                    "M=D",
                    "@SP",
                    "M=M+1"
                ];
            } else if (["local", "argument", "this", "that"].includes(command.segment)) {
                const symbolsMap = {
                    "local": "LCL",
                    "argument": "ARG",
                    "this": "THIS",
                    "that": "THAT"
                }
                const symbol = symbolsMap[command.segment];

                lines = [
                    `// push ${command.segment} ${command.address}`,
                    `@${command.address}`,
                    "D=A",
                    `@${symbol}`,
                    "A=M+D",
                    "D=M",
                    "@SP",
                    "A=M",
                    "M=D",
                    "@SP",
                    "M=M+1"
                ];
            } else if (command.segment === "static") {
                lines = [
                    `// push ${command.segment} ${command.address}`,
                    `@Foo.${command.address}`,
                    "D=M",
                    "@SP",
                    "A=M",
                    "M=D",
                    "@SP",
                    "M=M+1"
                ];
            } else if (command.segment === "temp") {
                const addr = this.#TEMP_SEGMENT_BASE_ADDRESS + command.address;

                if (addr > 12) throw new Error(`"temp" segment overflow`);

                lines = [
                    `// push ${command.segment} ${command.address}`,
                    `@R${addr}`,
                    "D=M",
                    "@SP",
                    "A=M",
                    "M=D",
                    "@SP",
                    "M=M+1"
                ];
            } else if (command.segment === "pointer") {
                if (command.address > 1) throw new Error(`Invalid "pointer" segment address`);

                const symbol = command.address === 0 ? "THIS" : "THAT";

                lines = [
                    `// push ${command.segment} ${command.address}`,
                    `@${symbol}`,
                    "D=M",
                    "@SP",
                    "A=M",
                    "M=D",
                    "@SP",
                    "M=M+1"
                ];
            } else {
                throw new Error(`Segment is not recognized: ${command.segment}`)
            }
        } else if (command.commandType === "C_POP") {
            if (["local", "argument", "this", "that"].includes(command.segment)) {
                const symbolsMap = {
                    "local": "LCL",
                    "argument": "ARG",
                    "this": "THIS",
                    "that": "THAT"
                }
                const symbol = symbolsMap[command.segment];

                lines = [
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
                    "M=D"
                ];
            } else if (command.segment === "static") {
                lines = [
                    `// pop ${command.segment} ${command.address}`,
                    "@SP",
                    "AM=M-1",
                    "D=M",
                    `@Foo.${command.address}`,
                    "M=D",
                ];
            } else if (command.segment === "temp") {
                const addr = this.#TEMP_SEGMENT_BASE_ADDRESS + command.address;

                if (addr > 12) throw new Error(`"temp" segment overflow`);

                lines = [
                    `// pop ${command.segment} ${command.address}`,
                    "@SP",
                    "AM=M-1",
                    "D=M",
                    `@R${addr}`,
                    "M=D",
                ];
            } else if (command.segment === "pointer") {
                if (command.address > 1) throw new Error(`Invalid "pointer" segment address`);

                const symbol = command.address === 0 ? "THIS" : "THAT";

                lines = [
                    `// pop ${command.segment} ${command.address}`,
                    "@SP",
                    "AM=M-1",
                    "D=M",
                    `@${symbol}`,
                    "M=D",
                ];
            } else {
                throw new Error(`Segment is not recognized: ${command.segment}`)
            }
        } else if (command.commandType === "C_ARITHMETIC") {
            if (command.arithmeticOperationType === "add") {
                lines = [
                    "// add (x, y)",
                    "@SP",
                    "AM=M-1",
                    "D=M // Load y into D register",
                    "@SP",
                    "AM=M-1",
                    "M=M+D // Compute x + y",
                    "@SP",
                    "M=M+1 // Advance stack pointer"
                ];
            } else if (command.arithmeticOperationType === "sub") {
                lines = [
                    "// sub (x, y)",
                    "@SP",
                    "AM=M-1",
                    "D=M // Load y into D register",
                    "@SP",
                    "AM=M-1",
                    "M=M-D // Compute x - y",
                    "@SP",
                    "M=M+1 // Advance stack pointer"
                ];
            } else if (command.arithmeticOperationType === "neg") {
                lines = [
                    "// neg",
                    "@SP",
                    "AM=M-1",
                    "M=-M",
                    "@SP",
                    "M=M+1 // Advance stack pointer"
                ];
            } else {
                throw new Error(`Arithmetic operation type is not recognized: ${command.arithmeticOperationType}`)
            }
        } else if (command.commandType === "C_LOGICAL") {
            if (["eq", "gt", "lt"].includes(command.logicalOperationType)) {
                const jumpsMap = {
                    "eq": "JEQ",
                    "gt": "JGT",
                    "lt": "JLT",
                };
                const jump = jumpsMap[command.logicalOperationType];

                lines = [
                    `// ${command.logicalOperationType} (x,y)`,
                    "@SP",
                    "AM=M-1 // Point to y",
                    "D=M // Load y into D register",
                    "@SP",
                    "AM=M-1 // Point to x",
                    "D=M-D // Load result of 'x - y' into D register",
                    `@CONDITION_MET_${this.#labelCounter}`,
                    `D;${jump} // Jump if condition is met`,
                    "@SP",
                    "A=M // Point to the top of the stack",
                    "M=0   // Set to false (0)",
                    `@CONTINUE_${this.#labelCounter}`,
                    "0;JMP // Jump to CONTINUE",
                    `(CONDITION_MET_${this.#labelCounter})`,
                    "@SP",
                    "A=M // Point to the top of the stack",
                    "M=-1 // Set to true (-1)",
                    `(CONTINUE_${this.#labelCounter})`,
                    "@SP",
                    "M=M+1 // Advance stack pointer",
                ];

                this.#labelCounter++;
            } else if (["and", "or"].includes(command.logicalOperationType)) {
                const computationsMap = {
                    "and": "D&M",
                    "or": "D|M",
                };
                const comp = computationsMap[command.logicalOperationType];

                lines = [
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
                ]
            } else if (command.logicalOperationType === "not") {
                lines = [
                    "// not (x)",
                    "@SP",
                    "AM=M-1 // Point to x",
                    "D=M // Load x into D register",
                    "@SP",
                    "A=M // Point to the top of the stack",
                    "M=!D // Save computation result to the top of the stack",
                    "@SP",
                    "M=M+1 // Advance stack pointer",
                ]
            } else {
                throw new Error(`Logical operation type is not recognized: ${command.logicalOperationType}`)
            }
        } else {
            throw new Error(`Command type is not recognized: ${command.commandType}`)
        }

        const content = lines.join("\n") + "\n\n";
        fs.appendFileSync(this.#filePath, content);
    }
}

module.exports = CodeWriter;
