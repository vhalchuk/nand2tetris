import { ICodeWriter } from "./interfaces";
import { Command, Segment } from "./enums";
import fs from "fs";

export default class CodeWriter implements ICodeWriter {
  #writeStream: fs.WriteStream;

  constructor(writeStream: fs.WriteStream) {
    this.#writeStream = writeStream;
  }

  #print(value: string) {
    this.#writeStream.write(`${value}\n`);
  }

  writePush(segment: Segment, index: number) {
    this.#print(`push ${segment} ${index}`);
  }

  writePop(segment: Segment, index: number) {
    this.#print(`pop ${segment} ${index}`);
  }

  writeArithmetic(command: Command) {
    this.#print(command);
  }

  writeLabel(label: string) {
    this.#print(`label ${label}`);
  }

  writeGoto(label: string) {
    this.#print(`goto ${label}`);
  }

  writeIf(label: string) {
    this.#print(`if-goto ${label}`);
  }

  writeCall(name: string, nArgs: number) {
    this.#print(`call ${name} ${nArgs}`);
  }

  writeFunction(name: string, nVars: number) {
    this.#print(`function ${name} ${nVars}`);
  }

  writeReturn() {
    this.#print("return");
  }

  close() {
    this.#writeStream.close();
  }
}
