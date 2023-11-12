import { ISymbolTable, SymbolData, SymbolTableEntry } from "./interfaces";
import { Kind } from "./enums";

export default class SymbolTable implements ISymbolTable {
  #table: Map<SymbolTableEntry["name"], Omit<SymbolTableEntry, "name">>;
  #indexTable: Map<Kind, number>;

  constructor() {
    this.#table = new Map();
    this.#indexTable = new Map([
      [Kind.STATIC, 0],
      [Kind.FIELD, 0],
      [Kind.ARG, 0],
      [Kind.VAR, 0],
    ]);
  }

  reset() {
    this.#table = new Map();
    this.#indexTable = new Map([
      [Kind.STATIC, 0],
      [Kind.FIELD, 0],
      [Kind.ARG, 0],
      [Kind.VAR, 0],
    ]);
  }

  define({ name, type, kind }: SymbolData) {
    const index = this.#indexTable.get(kind);

    if (typeof index === "undefined") {
      throw new Error(`Count for ${kind} kind must be defined`);
    }

    this.#table.set(name, { type, kind, index });
    this.#indexTable.set(kind, index + 1);
  }

  varCount(kind: Kind) {
    const index = this.#indexTable.get(kind);

    if (typeof index === "undefined") {
      throw new Error(`Count for ${kind} kind is not defined`);
    }

    return index;
  }

  kindOf(name: string) {
    return this.#table.get(name)?.kind;
  }

  typeOf(name: string) {
    return this.#table.get(name)?.type;
  }

  indexOf(name: string) {
    return this.#table.get(name)?.index;
  }
}
