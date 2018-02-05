import * as fs from 'fs-extra'
import { createInterface, ReadLine } from 'readline'

// A_COMMAND: @Xxxを表し、Xxxはシンボルか10進数の数
const A_COMMAND = /^@(\w+)/
// C_COMMAND: dest=comp:jump(destもしくはjumpのどちらかは空であるかもしれない、destが空なら`=`が、jumpが空なら`;`が省略される)
const C_COMMAND = /^$/
// L_COMMAND: 疑似コマンド`(Xxx)`を意味し、Xxxはシンボルとなる
const L_COMMAND = /\((\w+)\)/

export default class Parser {
  readLine: ReadLine
  filepath: string

  constructor(filepath: string) {
    this.filepath = filepath
  }

  load() {
    const stream: fs.ReadStream = fs.createReadStream(`${__dirname}/${this.filepath}`, 'utf-8')
    const readLine: ReadLine = createInterface({
      input: stream,
    })

    readLine.on('line', (line) => {
      console.log(`coming a line: ${line}`)
    })

    this.readLine = readLine;
  }

  hasMoreCommands() {

  }
}
