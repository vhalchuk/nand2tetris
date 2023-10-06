const fs = require('fs');
const path = require('path');

class FileManipulator {
    /**
     * @param {string} filePath
     */
    read(filePath) {
        try {
            return fs.readFileSync(filePath, "utf8");
        } catch (error) {
            throw new Error(`Error reading file at ${filePath}: ${error.message}`);
        }
    }

    /**
     * @param {string} filePath
     * @param {string} data
     * @param {string} newExtension
     */
    write(filePath, data, newExtension) {
        const dirName = path.dirname(filePath);
        const baseName = path.basename(filePath, path.extname(filePath));
        const newPath = path.join(dirName, baseName + newExtension);

        try {
            fs.writeFileSync(newPath, data, "utf-8");
        } catch (err) {
            throw new Error(`Error writing file at ${newPath}: ${err.message}`);
        }
    }
}

module.exports = FileManipulator;