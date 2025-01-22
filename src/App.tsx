import { useState } from "react"
import UpdateElectron from "@/components/update"
import logoVite from "./assets/logo-vite.svg"
import logoElectron from "./assets/logo-electron.svg"
import "./App.css"
import { Editor } from "@monaco-editor/react"
import YourSvg from "./assets/excute.svg"
import LEXER from "./lexer"
import cLEXER from "./cLexer"

function App(this: any) {
   const [value, setValue] = useState("")

   const changeCodeFunc = function (value: any) {
      setValue(value)
      // cLEXER(value)
   }

   const editorOptions = {
      fontSize: 20,
      minimap: {
         enabled: false,
      },
   }

   return (
      <>
         <img src="../src/assets/line.png" alt="line" className="line" />
         <div className="container">
            <div className="editor__box">
               {" "}
               <div>Editor</div>
               <div></div>
               <div className="editor">
                  <Editor
                     height="100%"
                     width="100%"
                     defaultLanguage="c"
                     defaultValue='printf("Hello, PyramidLexer")'
                     theme="vs-dark"
                     options={editorOptions}
                     value={value}
                     onChange={changeCodeFunc}
                  />
               </div>
            </div>
            <div className="result__bix"></div>

            <div className="result">
               <div className="result__table">{cLEXER(value)}</div>
            </div>
         </div>

         <div className="App">
            <UpdateElectron />
         </div>
      </>
   )
}

export default App
