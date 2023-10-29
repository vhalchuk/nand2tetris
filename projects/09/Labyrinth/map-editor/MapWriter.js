module.exports = class MapWriter {
  getCode(input) {
    const grid = this.#getGrid(input);
    const commands = [];

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === "#") {
          commands.push(
            `do setBlock(${cellIndex}, ${rowIndex}, 1);`
          )
        }
      })
    });

    return commands.join("\n");
  }

  #getGrid(input) {
    if (typeof input !== "string") {
      throw new Error("Input must be a string");
    }

    const rows = input.trim().split("\n");

    if (rows.length < 16) {
      throw new Error("Input should consist of 16 rows")
    }

    const invalidRowLength = rows.some((row) => row.length !== 32);

    if (invalidRowLength) {
      throw new Error("Each row should be 32 characters long");
    }

    const grid = rows.map((row) => row.split(""));

    grid.forEach((row) => row.forEach((cell) => {
      if (![".", "#"].includes(cell)) {
        throw new Error(`Invalid cell value: "${cell}"`)
      }
    }))

    return grid;
  }
}