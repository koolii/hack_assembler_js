import * as fs from 'fs-extra'
import { createInterface, ReadLine } from 'readline'

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

  hasMoreCommands() {}
  advance() {}
  commandType() {}
  symbol() {}
  dest() {}
  comp() {}
  jump() {}
}
