const fs = require("fs");
const path = require("path");
const MapWriter = require("./MapWriter");

class Main {
  static main() {
    const input = fs.readFileSync(
      path.resolve("./input.txt"),
      { encoding: "utf8" }
    );

    const mapWriter = new MapWriter();
    const code = mapWriter.getCode(input);

    fs.writeFileSync(
      path.resolve("./output.txt"),
      code,
      { encoding: "utf8" }
    );
  }
}

Main.main();