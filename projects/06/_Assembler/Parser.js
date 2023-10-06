/**
 * @typedef {Object} AInstruction
 * @property {string} type - Should always be "A_INSTRUCTION"
 * @property {string} value - The value of the A-instruction
 */

/**
 * @typedef {Object} CInstruction
 * @property {string} type - Should always be "C_INSTRUCTION"
 * @property {string|null} jmp - The jmp part of the instruction or null
 * @property {string|null} dest - The dest part of the instruction or null
 * @property {string} comp - The comp part of the instruction
 */

/**
 * @typedef {Object} Label
 * @property {string} type - Should always be "LABEL"
 * @property {string} value - The value of the label
 */

/**
 * @typedef {AInstruction | CInstruction | Label} Token
 */

class Parser {
    /** @type Token[] */
    #tokens

    constructor() {
        this.#tokens = [];
    }

    /**
     * @param {string} content
     */
    parse(content) {
        const lines = content.split("\n");

        for (const line of lines) {
            const strippedLine = line
                .replace(/\/\/.*$/gm, "")
                .replace(/\/\*.*\*\//gm, "")
                .trim();

            if (strippedLine.length === 0) continue;

            if (strippedLine.startsWith("@")) {
                this.#tokens.push({ type: "A_INSTRUCTION", value: strippedLine.substring(1) });
            } else if (strippedLine.startsWith("(") && strippedLine.endsWith(")")) {
                this.#tokens.push({ type: "LABEL", value: strippedLine.slice(1, -1) });
            } else {
                const [destAndComp, jmp = null] = strippedLine.split(";");

                let dest;
                let comp;

                const match = destAndComp.match(/^(.+)=(.+)$/);
                if (match) {
                    dest = match[1];
                    comp = match[2];
                } else {
                    dest = null;
                    comp = destAndComp
                }

                this.#tokens.push({
                    type: "C_INSTRUCTION",
                    jmp,
                    dest,
                    comp
                });
            }
        }
    }

    getTokens() {
        return this.#tokens;
    }
}

module.exports = Parser;
exports.AInstruction = /** @type {AInstruction} */ ({});
exports.CInstruction = /** @type {CInstruction} */ ({});