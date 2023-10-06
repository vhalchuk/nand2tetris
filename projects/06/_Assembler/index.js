const Assembler = require("./Assembler");
const CodeTranslator = require("./CodeTranslator");
const SymbolTable = require("./SymbolTable");
const FileManipulator = require("./FileManipulator");
const Parser = require("./Parser");

class Main {
    static init() {
        const inputFilePath = process.argv[2];

        if (!inputFilePath) {
            throw new Error("Input file path must be specified");
        }

        const symbolTable = new SymbolTable();
        const codeTranslator = new CodeTranslator();
        const fileManipulator = new FileManipulator();
        const parser = new Parser();
        const assembler = new Assembler({
            symbolTable,
            codeTranslator,
            fileManipulator,
            parser,
        });
        assembler.assemble(inputFilePath);
    }
}

Main.init();