import path from "path";
import { cwd, argv } from "process";
import fs from "fs";
import Parser from "./Parser";
import CodeWriter from "./CodeWriter";

class VMTranslator {
  static translateFile(readPath: string) {
    const dirName = path.dirname(readPath);
    const baseName = path.basename(readPath, path.extname(readPath));
    const writePath = path.join(dirName, `${baseName}.asm`);

    const parser = new Parser(readPath);
    const codeWriter = new CodeWriter(writePath);

    while (parser.hasMoreCommands()) {
      parser.advance();
      if (parser.currentCommand) {
        codeWriter.writeCommand(parser.currentCommand);
      }
    }
    codeWriter.close();
  }

  static translateDirectory(readPath: string) {
    const files = fs.readdirSync(readPath);
    const vmFiles = files.filter((file) => path.extname(file) === ".vm");

    const filePaths = vmFiles.map((file) => path.join(readPath, file));

    const baseName = path.basename(readPath);
    const writePath = path.join(readPath, `${baseName}.asm`);
    const codeWriter = new CodeWriter(writePath);

    codeWriter.writeBootstrapCode();

    filePaths.forEach((filePath) => {
      const parser = new Parser(filePath);
      const className = path.basename(filePath, ".vm");
      codeWriter.setClassName(className);

      while (parser.hasMoreCommands()) {
        parser.advance();
        if (parser.currentCommand) {
          codeWriter.writeCommand(parser.currentCommand);
        }
      }
    });
    codeWriter.close();
  }

  static main() {
    const source = argv[2];

    if (!source) throw new Error("Source must be specified");

    const readPath = path.join(cwd(), source);
    const stats = fs.statSync(readPath);

    if (stats.isFile()) {
      this.translateFile(readPath);
    } else if (stats.isDirectory()) {
      this.translateDirectory(readPath);
    }
  }
}

VMTranslator.main();
