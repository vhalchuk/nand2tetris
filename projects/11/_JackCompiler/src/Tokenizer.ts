import { ITokenizer, Token } from "./interfaces";
import { KeyWord, keyWords, symbols, TokenType } from "./enums";

export default class Tokenizer implements ITokenizer {
  currentToken: Token | null;

  #data: string;

  #currentCharIndex: number;

  #nextToken: null | { type: TokenType; value: string };

  constructor(data: string) {
    this.#data = data;
    this.#currentCharIndex = 0;
    this.#nextToken = null;

    this.currentToken = null;
  }

  hasMoreTokens() {
    this.lookAhead();

    return this.#nextToken !== null;
  }

  advance() {
    this.currentToken = this.#nextToken || this.#parseNextToken();
    this.#nextToken = null;
  }

  lookAhead() {
    this.#nextToken = this.#nextToken || this.#parseNextToken();
    return this.#nextToken;
  }

  #parseNextToken(): null | Token {
    const data = this.#data;
    let buffer = "";
    let i = this.#currentCharIndex;
    let isCommentLine = false;
    let isInlineComment = false;
    let isStringConstant = false;

    while (i < data.length) {
      const char = data[i];
      const nextChar = data[i + 1];

      if (isCommentLine) {
        if (char === "\n") {
          isCommentLine = false;
        }
        i++;
        continue;
      } else if (char === "/" && nextChar === "/") {
        isCommentLine = true;
        i = i + 2;
        continue;
      }

      if (isInlineComment) {
        if (char === "*" && nextChar === "/") {
          isInlineComment = false;
          i = i + 2;
        } else {
          i++;
        }
        continue;
      } else if (char === "/" && nextChar === "*") {
        isInlineComment = true;
        i = i + 2;
        continue;
      }

      if (isStringConstant) {
        buffer += char;
        if (nextChar === `"`) {
          buffer += nextChar;
          isStringConstant = false;
          i = i + 2;
        } else {
          i++;
        }
        continue;
      } else if (buffer.length === 0 && char === `"`) {
        isStringConstant = true;
        i++;
        buffer += `"`;
        continue;
      }

      const emptySymbols = [" ", "\n", "\r", "\t"];

      if (buffer.length === 0 && emptySymbols.includes(char)) {
        i++;
        continue;
      }

      if (buffer.length === 0 && symbols.includes(char)) {
        i++;
        buffer = char;
        break;
      }

      if (buffer.length > 0 && [...emptySymbols, ...symbols].includes(char)) {
        break;
      }

      i++;
      buffer += char;
    }

    this.#currentCharIndex = i;

    if (buffer.length === 0) {
      return null;
    }

    if (keyWords.includes(buffer as any)) {
      return {
        type: TokenType.Keyword,
        value: buffer,
      };
    }

    if (symbols.includes(buffer)) {
      return {
        type: TokenType.Symbol,
        value: buffer,
      };
    }

    if (/^[0-9]+$/.test(buffer)) {
      return {
        type: TokenType.IntConst,
        value: buffer,
      };
    }

    if (buffer.startsWith(`"`) && buffer.endsWith(`"`)) {
      return {
        type: TokenType.StringConst,
        value: buffer.slice(1, buffer.length - 1),
      };
    }

    return {
      type: TokenType.Identifier,
      value: buffer,
    };
  }
}
