class SymbolTable {
    /** @type Map */
    #table

    constructor() {
        this.#table = new Map();
    }

    /**
     * @param {string} label
     * @param {number} address
     */
    add(label, address) {
        this.#table.set(label, address);
    }

    /**
     * @method
     * @returns {number}
     */
    get(label) {
        return this.#table.get(label);
    }

    /**
     * @param {string} label
     */
    has(label) {
        return this.#table.has(label);
    }
}

module.exports = SymbolTable;