const path = require("path");
const Parser = require("./Parser");
const CodeWriter = require("./CodeWriter");

class VMTranslator {
    static main() {
        const fileName = process.argv[2];
        const currentDir = process.cwd();
        const filePath = path.join(currentDir, fileName);

        if (!filePath) {
            throw new Error("Input file path must be specified");
        }

        const dirName = path.dirname(filePath);
        const baseName = path.basename(filePath, path.extname(filePath));
        const newPath = path.join(dirName, baseName + ".asm");

        const parser = new Parser(filePath);
        const codeWriter = new CodeWriter(newPath);

        while(parser.hasMoreCommands()) {
            parser.advance();
            const command = parser.currentCommand;

            if (command) {
                codeWriter.write(command);
            }
        }
    }
}

VMTranslator.main();
