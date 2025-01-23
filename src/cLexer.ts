type Token = {
   type: string
   value: string
   token: string | number
}

type TokenError = {
   value: string
   row: number
   col: number
   suggest?: string
}

const ENUM_CONST = {
   //single operation
   OpenSBracket: "[",
   CloserSBracket: "]",
   Interrobang: "!",
   Equals: "=",
   OpenABracket: ">",
   CloseABracket: "<",
   Division: "%",
   Slash: "/",
   Asterism: "*",
   Minus: "-",
   Plus: "+",
   Semicolon: ";",
   Comma: ",",
   OpenBrace: "}",
   CloseBrace: "{",
   OpenBracket: ")",
   CloserBracket: "(",

   //double operation
   AND: "&&",
   OR: "||",
   NE: "!=",
   EQ: "==",
   GE: "<=",
   LE: ">=",

   //keyword
   IF: "if",
   ElSE: "else",
   WHILE: "while",
   RETURN: "return",
   BREAK: "break",
   NEW: "new",
   SIZE: "size",
   VOID: "void",

   //boolean
   BOOL_LIT_F: "false",
   BOOL_LIT_T: "true",
}

const ENUM_ARRAY = {
   S_OPERATION: [
      ENUM_CONST.OpenSBracket,
      ENUM_CONST.CloserSBracket,
      ENUM_CONST.Interrobang,
      ENUM_CONST.Equals,
      ENUM_CONST.OpenABracket,
      ENUM_CONST.CloseABracket,
      ENUM_CONST.Division,
      ENUM_CONST.Slash,
      ENUM_CONST.Asterism,
      ENUM_CONST.Minus,
      ENUM_CONST.Plus,
      ENUM_CONST.Semicolon,
      ENUM_CONST.Comma,
      ENUM_CONST.OpenBrace,
      ENUM_CONST.CloseBrace,
      ENUM_CONST.OpenBracket,
      ENUM_CONST.CloserBracket,
   ],

   D_OPERATION: [
      ENUM_CONST.AND,
      ENUM_CONST.OR,
      ENUM_CONST.NE,
      ENUM_CONST.EQ,
      ENUM_CONST.GE,
      ENUM_CONST.LE,
   ],

   KEYWORDS: [
      ENUM_CONST.IF,
      ENUM_CONST.ElSE,
      ENUM_CONST.WHILE,
      ENUM_CONST.RETURN,
      ENUM_CONST.BREAK,
      ENUM_CONST.NEW,
      ENUM_CONST.SIZE,
      ENUM_CONST.VOID,
   ],

   BOOL: [ENUM_CONST.BOOL_LIT_F, ENUM_CONST.BOOL_LIT_T],
}

class CLexer {
   private input: string
   private position: number
   private tokens: (Token | TokenError)[]
   private lookHead: { row: number; col: number } = { row: 0, col: 0 }

   constructor(input: string) {
      this.input = input
      this.position = 0
      this.tokens = []
      this.lookHead = { row: 1, col: 0 }
   }

   start(): any {
      while (this.position < this.input.length) {
         const char = this.currentChar()
         if (this.isWhitespace(char)) {
            this.nextPosition()
         } else if (char === "/" && this.nextChar() === "/") {
            this.skipSingleLineComment()
         } else if (char === "/" && this.nextChar() === "*") {
            this.skipMultiLineComment()
         } else if (char == "_" || this.isLetter(char) || this.isDigit(char)) {
            this.tokens.push(this.wordReader())
         } else {
            this.tokens.push(this.readSymbol())
         }
      }

      return this.tokens
   }

   private currentChar(): string {
      return this.input[this.position] || ""
   }

   private nextChar(): string {
      return this.input[this.position + 1] || ""
   }

   private nextPosition(): string {
      this.lookHead.col++

      return this.input[this.position++] || ""
   }

   private isWhitespace(char: string): boolean {
      if (/\s/.test(char)) {
         if (char === "\n") {
            this.lookHead.col = -1
            this.lookHead.row++
         }

         return true
      } else {
         return false
      }
   }

   private isLetter(char: string): boolean {
      return /[a-zA-Z_]/.test(char)
   }

   private isDigit(char: string): boolean {
      return /[0-9]/.test(char)
   }

   private skipSingleLineComment(): void {
      while (this.currentChar() !== "\n" && this.currentChar() !== "") {
         this.nextPosition()
      }
   }

   private skipMultiLineComment(): void {
      this.nextPosition()
      this.nextPosition()

      while (
         !(this.currentChar() === "*" && this.nextChar() === "/") &&
         this.currentChar() !== ""
      ) {
         this.nextPosition()
      }

      if (this.currentChar() === "*" && this.nextChar() === "/") {
         this.nextPosition()
         this.nextPosition()
      }
   }

   private isKeyword(word: string): boolean {
      const keywords = [
         "if",
         "else",
         "while",
         "for",
         "return",
         "break",
         "new",
         "size",
         "void",
         "bool",
         "int",
         "float",
      ]
      return keywords.includes(word)
   }

   private isBoolean(word: string): boolean {
      if (ENUM_ARRAY.BOOL.indexOf(word) != -1) {
         return true
      }
      return false
   }

   private readSymbol(): Token | TokenError {
      let value = `${this.currentChar()}${this.nextChar()}`
      const indexOfDouble = ENUM_ARRAY.D_OPERATION.indexOf(value)
      if (indexOfDouble != -1) {
         this.nextPosition()
         this.nextPosition()

         return {
            type: "SYMBOL",
            value: value,
            token:
               Object.entries(ENUM_CONST).find(
                  ([key, val]) => val === value
               )?.[0] || "",
         }
      } else {
         value = this.currentChar()
         const indexOfSingle = ENUM_ARRAY.S_OPERATION.indexOf(value)
         if (indexOfSingle != -1) {
            this.nextPosition()

            return {
               type: "SYMBOL",
               value: value,
               token: value.charCodeAt(0),
            }
         }
      }

      this.nextPosition()

      return {
         value: value,
         col: this.lookHead.col,
         row: this.lookHead.row,
         suggest: "REMOVE IT",
      }
   }

   private isProbabilitySymbol(): boolean {
      let sign = [
         "[",
         "]",
         "!",
         "=",
         ">",
         "<",
         "%",
         "/",
         "*",
         "-",
         "+",
         ";",
         ",",
         "}",
         "{",
         ")",
         "(",
         "&",
         "|",
         "!",
      ]

      if (sign.indexOf(this.currentChar()) != -1) {
         return false
      }
      return true
   }

   private wordReader(): Token | TokenError {
      let value = ""

      // while (
      //    this.isLetter(this.currentChar()) ||
      //    this.isDigit(this.currentChar()) ||
      //    this.currentChar() == "_"
      // ) {
      //    value = value + this.currentChar()
      //    this.nextPosition()
      //    if (this.position > this.input.length) {
      //       break
      //    }
      // }

      while (
         this.currentChar() !== " " &&
         this.currentChar() !== "\n" &&
         this.currentChar() !== "\r" &&
         this.isProbabilitySymbol()
      ) {
         value += this.currentChar()
         this.nextPosition()
         if (this.position > this.input.length) {
            break
         }
      }

      if (this.isKeyword(value)) {
         return {
            type: "KEYWORD",
            value: value,
            token: value.toUpperCase(),
         }
      } else if (this.isBoolean(value)) {
         return {
            type: "BOOLEAN",
            value: value,
            token: "BOOL_LIT",
         }
      } else if (/^\d+$/.test(value)) {
         return {
            type: "INT",
            value: value,
            token: "INT_LIT",
         }
      } else if (/^\d+(\.\d+)?$/.test(value)) {
         return {
            type: "FLOAT",
            value: value,
            token: "FLOAT_LIT",
         }
      } else if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(value)) {
         return {
            type: "IDENTIFIER",
            value: value,
            token: "IDENT",
         }
      }
      const debuggedValue = this.Debugger(value)

      if (debuggedValue != false) {
         return debuggedValue
      }

      return {
         value: value,
         col: this.lookHead.col,
         row: this.lookHead.row,
         suggest: "-",
      }
   }

   private Debugger(value: string): any {
      const newValue: string = value
         .split("")
         .filter((ch) => {
            if (this.isLetter(ch) || this.isDigit(ch) || ch == "_") {
               return ch
            }
         })
         .join("")

      if (this.isSuggesting(newValue)) {
         if (this.isKeyword(newValue)) {
            return {
               value: value,
               col: this.lookHead.col,
               row: this.lookHead.row,
               suggest: newValue,
            }
         } else if (this.isBoolean(newValue)) {
            return {
               value: value,
               col: this.lookHead.col,
               row: this.lookHead.row,
               suggest: newValue,
            }
         } else if (/^\d+$/.test(newValue)) {
            return {
               value: value,
               col: this.lookHead.col,
               row: this.lookHead.row,
               suggest: newValue,
            }
         } else if (/^\d+(\.\d+)?$/.test(newValue)) {
            return {
               value: value,
               col: this.lookHead.col,
               row: this.lookHead.row,
               suggest: newValue,
            }
         } else if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(newValue)) {
            return {
               value: value,
               col: this.lookHead.col,
               row: this.lookHead.row,
               suggest: newValue,
            }
         }
      }

      return false
   }

   private isSuggesting(value: string): boolean {
      if (
         this.isKeyword(value) ||
         this.isBoolean(value) ||
         /^\d+$/.test(value) ||
         /^\d+(\.\d+)?$/.test(value) ||
         /^[a-zA-Z_][a-zA-Z_0-9]*$/.test(value)
      ) {
         return true
      }
      return false
   }
}

const cLEXER = function (value: string) {
   if (value.length) {
      const code = value
      const lexer = new CLexer(code)
      const tokens = lexer.start()

      return tokens
   }
}

export default cLEXER
