import fs from "fs";
import { argv, cwd } from "process";
import path from "path";
import Tokenizer from "./Tokenizer";
import CompilationEngine from "./CompilationEngine";
import CodeWriter from "./CodeWriter";

class Main {
  static main() {
    const source = argv[2];

    if (!source) throw new Error("Source argument must be specified");

    const readPath = path.join(cwd(), source);
    const stats = fs.statSync(readPath);

    if (stats.isFile()) {
      this.translateFile(readPath);
    } else if (stats.isDirectory()) {
      this.translateDirectory(readPath);
    }
  }

  static translateFile(readPath: string) {
    const readData = fs.readFileSync(readPath, "utf-8");
    const dirName = path.dirname(readPath);
    const baseName = path.basename(readPath, path.extname(readPath));
    const writePath = path.join(dirName, `${baseName}.vm`);
    fs.writeFileSync(writePath, "");
    const writeStream = fs.createWriteStream(writePath, { flags: "a" });

    const tokenizer = new Tokenizer(readData);
    const codeWriter = new CodeWriter(writeStream);
    const compilationEngine = new CompilationEngine(tokenizer, codeWriter);

    compilationEngine.compileClass();
  }

  static translateDirectory(readPath: string) {
    const files = fs.readdirSync(readPath);
    const jackFiles = files.filter((file) => path.extname(file) === ".jack");
    const filePaths = jackFiles.map((file) => path.join(readPath, file));

    filePaths.forEach(this.translateFile);
  }
}

Main.main();
