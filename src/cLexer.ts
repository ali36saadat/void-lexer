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

const cLEXER = function (value: string) {
   if (value.length) {
      const code = value
      const lexer = new CLexer(code)
      const tokens = lexer.tokenize()

      console.log(tokens)
   }
}

export default cLEXER

type Token = {
   type: string
   value: string
   token: string | number
}

type TokenError = {
   value: string
   row: number
   col: number
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

   tokenize(): any {
      while (this.position < this.input.length) {
         const char = this.peek()
         // console.log(this.lookHead)
         if (this.isWhitespace(char)) {
            this.advance()
         } else if (char === "/" && this.peekNext() === "/") {
            this.skipSingleLineComment()
         } else if (char === "/" && this.peekNext() === "*") {
            this.skipMultiLineComment()
         } else if (char == "_" || this.isLetter(char) || this.isDigit(char)) {
            this.tokens.push(this.wordReader())
         } else {
            // this.advance()
            this.tokens.push(this.readSymbol())
         }
      }

      return this.tokens
   }

   private peek(): string {
      return this.input[this.position] || ""
   }

   private peekNext(): string {
      return this.input[this.position + 1] || ""
   }

   private advance(): string {
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
      while (this.peek() !== "\n" && this.peek() !== "") {
         this.advance()
      }
   }

   private skipMultiLineComment(): void {
      this.advance() // Skip '/'
      this.advance() // Skip '*'

      while (
         !(this.peek() === "*" && this.peekNext() === "/") &&
         this.peek() !== ""
      ) {
         this.advance()
      }

      if (this.peek() === "*" && this.peekNext() === "/") {
         this.advance() // Skip '*'
         this.advance() // Skip '/'
      }
   }

   private readIdentifierOrKeyword(): Token {
      let value = ""

      while (
         this.isLetter(this.peek()) ||
         this.isDigit(this.peek()) ||
         this.peek() == "_"
      ) {
         value += this.advance()
      }

      return {
         type: this.isKeyword(value) ? "KEYWORD" : "IDENTIFIER",
         value,
         token: "asd",
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
      if (ENUM_ARRAY.BOOL.indexOf(word)) {
         return true
      }
      return false
   }

   private readNumber(): Token {
      let value = ""

      while (this.isDigit(this.peek())) {
         value += this.advance()
      }

      return { type: "NUMBER", value, token: "sadas" }
   }

   private readSymbol(): Token | TokenError {
      let value = `${this.peek()}${this.peekNext()}`
      const indexOfDouble = ENUM_ARRAY.D_OPERATION.indexOf(value)
      if (indexOfDouble != -1) {
         this.advance()
         this.advance()

         return {
            type: "SYMBOL",
            value: value,
            token:
               Object.entries(ENUM_CONST).find(
                  ([key, val]) => val === value
               )?.[0] || "",
         }
      } else {
         value = this.peek()
         const indexOfSingle = ENUM_ARRAY.S_OPERATION.indexOf(value)
         if (indexOfSingle != -1) {
            this.advance()

            return {
               type: "SYMBOL",
               value: value,
               token: value.charCodeAt(0),
            }
         }
      }

      this.advance()

      return {
         value: value,
         col: this.lookHead.col,
         row: this.lookHead.row,
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

      if (sign.indexOf(this.peek()) != -1) {
         return false
      }
      return true
   }

   private wordReader(): Token | TokenError {
      let value = ""

      // while (
      //    this.isLetter(this.peek()) ||
      //    this.isDigit(this.peek()) ||
      //    this.peek() == "_"
      // ) {
      //    value = value + this.peek()
      //    this.advance()
      //    if (this.position > this.input.length) {
      //       break
      //    }
      // }

      while (this.peek() != " " && this.isProbabilitySymbol()) {
         value += this.peek()
         this.advance()
         if (this.position > this.input.length) {
            break
         }
      }
      console.log(this.lookHead)
      console.log(value)

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

      // else {
      //    return {
      //       type: "ERROR",
      //       value: value,
      //       token: "ERROR",
      //    }
      // }

      // this.advance()

      return {
         value: value,
         col: this.lookHead.col,
         row: this.lookHead.row,
      }
   }
}
