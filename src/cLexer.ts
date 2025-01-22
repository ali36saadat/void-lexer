// interface token {
//    colNum: number
//    rowNum: number
//    nameNum: string
//    value: any
//    sign: string
//    type: string
// }

// const ENUM_CONST = {
//    //single operation
//    "1": { name: "Open S Bracket", sign: "[", type: "" },
//    2: { name: "Closer S Bracket", val: 122, sign: "]" },
//    3: { name: "Interrobang", sign: "!" },
//    4: { name: "Equals", sign: "=" },
//    5: { name: "Open A Bracket", sign: ">" },
//    6: { name: "Close A Bracket", sign: "<" },
//    7: { name: "Division", sign: "%" },
//    8: { name: "Slash", sign: "/" },
//    9: { name: "Asterism", sign: "*" },
//    10: { name: "Minus", sign: "-" },
//    11: { name: "Plus", sign: "+" },
//    12: { name: "Semicolon", sign: ";" },
//    13: { name: "Comma", sign: "," },
//    14: { name: "Open Brace", sign: "}" },
//    15: { name: "Close Brace", sign: "{" },
//    16: { name: "Open Bracket", sign: ")" },
//    17: { name: "Closer Bracket", sign: "(" },

//    //double operation
//    18: { name: "AND", val: 122, sign: "&&" },
//    19: { name: "OR", val: 122, sign: "||" },
//    20: { name: "NE", val: 122, sign: "!=" },
//    21: { name: "EQ", val: 122, sign: "==" },
//    22: { name: "GE", val: 122, sign: "<=" },
//    23: { name: "LE", val: 122, sign: ">=" },

//    //keyword
//    24: { name: "IF", val: 122, sign: "if" },
//    25: { name: "ElSE", val: 122, sign: "else" },
//    26: { name: "WHILE", val: 122, sign: "while" },
//    27: { name: "RETURN", val: 122, sign: "return" },
//    28: { name: "BREAK", val: 122, sign: "break" },
//    29: { name: "NEW", val: 122, sign: "new" },
//    30: { name: "SIZE", val: 122, sign: "size" },
//    31: { name: "VOID", val: 122, sign: "void" },

//    //boolean
//    32: { name: "BOOL_LIT", val: 122, sign: "false" },
//    33: { name: "BOOL_LIT", val: 122, sign: "true" },
// }

// class lexer {
//    code: string = ""
//    tokens: token[] = []
//    lookHead = { colNum: Number, rowNum: Number }
//    ISR: any

//    constructor(CODE: string) {
//       this.code = CODE
//    }

//    start() {
//       while (true) {

//       }
//    }

//    next_char() {

//    }
// }

const cLEXER = function (value: string) {
   const code = value
   const lexer = new CLexer(code)
   const tokens = lexer.tokenize()

   console.log(tokens)
}

export default cLEXER

type Token = {
   type: string
   value: string
   token: string
}

type TokenError = {
   value: string
   row: number
   col: number
}

class CLexer {
   private input: string
   private position: number
   private tokens: Token[]
   private lookHead: { row: number; col: number } = { row: 0, col: 0 }

   constructor(input: string) {
      this.input = input
      this.position = 0
      this.tokens = []
      this.lookHead = { row: 1, col: 0 }
   }

   tokenize(): Token[] {
      while (this.position < this.input.length) {
         const char = this.peek()

         if (this.isWhitespace(char)) {
            this.advance()
         } else if (char === "/" && this.peekNext() === "/") {
            this.skipSingleLineComment()
         } else if (char === "/" && this.peekNext() === "*") {
            this.skipMultiLineComment()
         } else if (char == "_" || this.isLetter(char) || this.isDigit(char)) {
            this.wordReader()
         }
         //  else if (this.isLetter(char) || char == "_") {
         //    this.tokens.push(this.readIdentifierOrKeyword())
         // } else if (this.isDigit(char)) {
         //    this.tokens.push(this.readNumber())
         // } else {
         //    this.tokens.push(this.readSymbol())
         // }
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

      console.log(this.lookHead)

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

   private readNumber(): Token {
      let value = ""

      while (this.isDigit(this.peek())) {
         value += this.advance()
      }

      return { type: "NUMBER", value, token: "sadas" }
   }

   private readSymbol(): Token {
      const symbolsSingle = [
         "(",
         ")",
         "{",
         "}",
         ",",
         ";",
         "+",
         "-",
         "*",
         "/",
         "%",
         "<",
         ">",
         "=",
         "!",
         "[",
         "]",
      ]
      const symbolsDouble = ["<=", ">=", "==", "!=", "||", "&&"]

      return {
         type: "SYMBOL",
         value: this.advance(),
         token: "asd",
      }
   }

   private wordReader() {
      let value = ""

      while (
         this.isDigit(this.peek()) ||
         this.isDigit(this.peek()) ||
         this.peek() == "_"
      ) {
         value += this.advance()
      }

      if (this.isKeyword(value)) {
         console.log("KEYWORD")
      } else if (/^\d+$/.test(value)) {
         console.log("INT")
      } else if (/^\d+(\.\d+)?$/.test(value)) {
         console.log("FLOAT")
      } else if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(value)) {
         console.log("IDENTIFIER")
      } else {
         console.log("!!ERROR!!")
      }

      // return 0
   }
}
