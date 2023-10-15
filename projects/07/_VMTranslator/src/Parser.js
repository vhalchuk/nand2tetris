const fs = require('fs');

/**
 * @typedef {import("./interfaces").Command} Command
 */

class Parser {
    /** @type string[] */
    #lines;

    /** @type number */
    #currentLineIndex;

    /** @type {(Command|null)} */
    #currentCommand;

    /**
     * @param filePath string
     */
    constructor(filePath) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        this.#lines = fileContent.split("\n");
        this.#currentLineIndex = 0;
    }

    get currentCommand() {
        return this.#currentCommand;
    }

    advance() {
        this.#currentCommand = null;

        while(this.hasMoreCommands()) {
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

            if (lineParts[0].startsWith("push")) {
                this.#currentCommand = {
                    commandType: "C_PUSH",
                    segment: lineParts[1],
                    address: Number(lineParts[2]),
                }
            }

            if (lineParts[0].startsWith("pop")) {
                this.#currentCommand = {
                    commandType: "C_POP",
                    segment: lineParts[1],
                    address: Number(lineParts[2]),
                }
            }

            if (["add", "sub", "neg"].includes(lineParts[0])) {
                this.#currentCommand = {
                    commandType: "C_ARITHMETIC",
                    arithmeticOperationType: lineParts[0],
                }
            }

            if (["eq", "gt", "lt", "and", "or", "not"].includes(lineParts[0])) {
                this.#currentCommand = {
                    commandType: "C_LOGICAL",
                    logicalOperationType: lineParts[0],
                }
            }

            this.#currentLineIndex++;

            if (this.#currentCommand) {
                break;
            } else {
                console.warn(`Could not parse command: "${strippedLine}"`)
            }
        }
    }

    hasMoreCommands() {
        return this.#currentLineIndex < this.#lines.length;
    }
}

module.exports = Parser;
