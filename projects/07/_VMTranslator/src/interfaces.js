/**
 * @typedef {Object} PushCommand
 * @property {"C_PUSH"} commandType
 * @property {Segment} segment
 * @property {number} address
 */

/**
 * @typedef {Object} PopCommand
 * @property {"C_POP"} commandType
 * @property {Segment} segment
 * @property {number} address
 */

/**
 * @typedef {"local" | "argument" | "static"} Segment
 */

/**
 * @typedef {Object} ArithmeticCommand
 * @property {"C_ARITHMETIC"} commandType
 * @property {ArithmeticOperationType} arithmeticOperationType
 */

/**
 * @typedef {"add" | "sub" | "neg"} ArithmeticOperationType
 */

/**
 * @typedef {Object} LogicalCommand
 * @property {"C_LOGICAL"} commandType
 * @property {LogicalOperationType} logicalOperationType
 */

/**
 * @typedef {"eq" | "gt" | "lt" | "and" | "or" | "not"} LogicalOperationType
 */

/**
 * @typedef {PushCommand | PopCommand | ArithmeticCommand | LogicalCommand} Command
 */

exports.PushCommand = /** @type {PushCommand} */ ({});
exports.PopCommand = /** @type {PopCommand} */ ({});
exports.ArithmeticCommand = /** @type {ArithmeticCommand} */ ({});
exports.LogicalCommand = /** @type {LogicalCommand} */ ({});
exports.Command = /** @type {Command} */ ({});
