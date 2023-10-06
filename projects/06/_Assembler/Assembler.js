/**
 * @typedef {import("./SymbolTable")} SymbolTable
 * @typedef {import("./CodeTranslator")} CodeTranslator
 * @typedef {import("./FileManipulator")} FileManipulator
 * @typedef {import("./Parser").AInstruction} AInstruction
 * @typedef {import("./Parser").CInstruction} CInstruction
 * @typedef {AInstruction | CInstruction} Instruction
 */

/**
 * @class
 */
class Assembler {
    /** @type SymbolTable */
    #symbolTable

    /** @type CodeTranslator */
    #codeTranslator

    /** @type FileManipulator */
    #fileManipulator

    /** @type Parser */
    #parser

    /** @type Instruction[] */
    #instructions;

    /** @type number */
    #nextAvailableMemoryAddress;

    /**
     * @param {Object} options
     * @param {SymbolTable} options.symbolTable
     * @param {CodeTranslator} options.codeTranslator
     * @param {FileManipulator} options.fileManipulator
     * @param {Parser} options.parser
     */
    constructor({
        symbolTable,
        codeTranslator,
        fileManipulator,
        parser,
    }) {
        this.#instructions = [];
        this.#nextAvailableMemoryAddress = 16;

        this.#symbolTable = symbolTable;
        this.#codeTranslator = codeTranslator;
        this.#fileManipulator = fileManipulator;
        this.#parser = parser;

        // predefine symbols
        this.#symbolTable.add("SP", 0);
        this.#symbolTable.add("LCL", 1);
        this.#symbolTable.add("ARG", 2);
        this.#symbolTable.add("THIS", 3);
        this.#symbolTable.add("THAT", 4);
        this.#symbolTable.add("SCREEN", 16384);
        this.#symbolTable.add("KBD", 24576);
        for (let i = 0; i < 16; i++) {
            this.#symbolTable.add(`R${i}`, i);
        }
    }

    /**
     * @param {string} filePath
     */
    assemble(filePath) {
        const fileContent = this.#fileManipulator.read(filePath);

        this.#parser.parse(fileContent);
        const tokens = this.#parser.getTokens();

        let instructionCounter = 0;

        for (const token of tokens) {
            if (token.type === "LABEL") {
                this.#symbolTable.add(token.value, instructionCounter);
            } else {
                this.#instructions.push(token);
                instructionCounter++;
            }
        }

        const compiledInstructions = [];

        for (const instruction of this.#instructions) {
            if (instruction.type === "A_INSTRUCTION") {
                if (/^[0-9]+$/.test(instruction.value)) {
                    const codeInstruction = this.#codeTranslator.numberToBinary16(parseInt(instruction.value));
                    compiledInstructions.push(codeInstruction)
                    continue;
                }

                let address = this.#symbolTable.get(instruction.value);

                if (typeof address === "undefined" || address === null) {
                    address = this.#nextAvailableMemoryAddress;
                    this.#symbolTable.add(instruction.value, address);
                    this.#nextAvailableMemoryAddress++;
                }

                const codeInstruction = this.#codeTranslator.numberToBinary16(address);
                compiledInstructions.push(codeInstruction)
            }

            if (instruction.type === "C_INSTRUCTION") {
                const jmpCode = this.#codeTranslator.jumpToBinary(instruction.jmp);
                const destCode = this.#codeTranslator.destToBinary(instruction.dest);
                const compCode = this.#codeTranslator.compToBinary(instruction.comp);

                const cInstructionCode = `111${compCode}${destCode}${jmpCode}`;
                compiledInstructions.push(cInstructionCode);
            }
        }

        const binaryCode = compiledInstructions.join("\n");

        this.#fileManipulator.write(filePath, binaryCode, ".hack");
    }
}

module.exports = Assembler;