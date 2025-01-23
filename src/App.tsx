import { useState } from "react"
import UpdateElectron from "@/components/update"
import logoVite from "./assets/logo-vite.svg"
import logoElectron from "./assets/logo-electron.svg"
import "./App.css"
import { Editor } from "@monaco-editor/react"
import YourSvg from "./assets/excute.svg"
import LEXER from "./lexer"
import cLEXER from "./cLexer"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { Hidden } from "@mui/material"

function createToken(type: string, value: string, token: string | number) {
   return { type, value, token }
}

function createErrorToken(col: number, row: number, value: string | number) {
   return { col, row, value }
}

function App(this: any) {
   const [value, setValue] = useState("")
   const [Token, setToken] = useState<
      { type: string; value: string; token: string | number }[]
   >([])
   const [ErrorToken, setErrorToken] = useState<
      { col: number; row: number; value: string | number }[]
   >([])

   const changeCodeFunc = function (value: any) {
      setValue(value)
      const AllTokens = cLEXER(value)

      const RightTokens = AllTokens.filter((obj: any) =>
         obj.hasOwnProperty("token")
      ).map((i: any) => {
         return createToken(i.type, i.value, i.token)
      })
      setToken(RightTokens)

      const ErrorTokens = AllTokens.filter((obj: any) =>
         obj.hasOwnProperty("col")
      ).map((i: any) => {
         return createErrorToken(i.col, i.row, i.value)
      })
      console.log(ErrorTokens)
      setErrorToken(ErrorTokens)
      // setToken()
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

            <div className="result__HA">
               <TableContainer
                  component={Paper}
                  sx={{ minHeight: 440, maxHeight: 440 }}>
                  <Table
                     stickyHeader
                     aria-label="sticky table"
                     sx={{
                        minWidth: 650,
                        minHeight: 100,
                        maxHeight: 100,
                        overflow: "hidden",
                     }}>
                     <TableHead>
                        <TableRow>
                           <TableCell align="center">TOKEN</TableCell>
                           <TableCell align="center">VALUE</TableCell>
                           <TableCell align="center">TOKEN</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {(Token.length != 0 ? Token : [])?.map((row) => (
                           <TableRow
                              sx={{
                                 "&:last-child td, &:last-child th": {
                                    border: 0,
                                    minHeight: 10,
                                    maxHeight: 10,
                                 },
                              }}>
                              <TableCell align="center" height={10}>
                                 {row.token}
                              </TableCell>
                              <TableCell align="center" height={10}>
                                 {row.value}
                              </TableCell>
                              <TableCell align="center" height={10}>
                                 {row.type}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TableContainer
                  component={Paper}
                  sx={{
                     minHeight: 200,
                     maxHeight: 200,
                     marginTop: 5,
                     bgcolor: "	#ffbaba",
                  }}>
                  <Table
                     stickyHeader
                     aria-label="sticky table"
                     sx={{
                        minWidth: 650,
                        minHeight: 100,
                        maxHeight: 100,
                        overflow: "hidden",
                     }}>
                     <TableHead>
                        <TableRow sx={{ bgcolor: "red" }}>
                           <TableCell
                              align="center"
                              sx={{ bgcolor: "#ff7b7b" }}>
                              COL
                           </TableCell>
                           <TableCell
                              align="center"
                              sx={{ bgcolor: "#ff7b7b" }}>
                              ROW
                           </TableCell>
                           <TableCell
                              align="center"
                              sx={{ bgcolor: "#ff7b7b" }}>
                              VALUE
                           </TableCell>
                           <TableCell
                              align="center"
                              sx={{ bgcolor: "#ff7b7b" }}>
                              SUGGEST
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {(ErrorToken.length != 0 ? ErrorToken : [])?.map(
                           (row) => (
                              <TableRow
                                 sx={{
                                    "&:last-child td, &:last-child th": {
                                       border: 0,
                                       minHeight: 10,
                                       maxHeight: 10,
                                    },
                                 }}>
                                 <TableCell align="center" height={10}>
                                    {row.col}
                                 </TableCell>
                                 <TableCell align="center" height={10}>
                                    {row.row}
                                 </TableCell>
                                 <TableCell align="center" height={10}>
                                    {row.value}
                                 </TableCell>{" "}
                                 <TableCell align="center" height={10}>
                                    {row.value}
                                 </TableCell>
                              </TableRow>
                           )
                        )}
                     </TableBody>
                  </Table>
               </TableContainer>
            </div>
         </div>

         <div className="App">
            <UpdateElectron />
         </div>
      </>
   )
}

export default App
