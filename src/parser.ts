import * as fs from 'fs-extra'
import { createInterface, ReadLine } from 'readline'


const COMMAND = {
  // A_COMMAND: @Xxxを表し、Xxxはシンボルか10進数の数
  A: {
    reg: /^@(\w +) /,
    type: 'A_COMMAND',
  },
  // C_COMMAND: dest=comp:jump(destもしくはjumpのどちらかは空であるかもしれない、destが空なら`=`が、jumpが空なら`;`が省略される)
  C: {
    reg: /[=|;]/,
    type: 'C_COMMAND',
  },
  // L_COMMAND: 疑似コマンド`(Xxx)`を意味し、Xxxはシンボルとなる
  L: {
    reg: /\((\w+)\)/,
    type: 'L_COMMAND',
  },
}

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

  parse(line: string) {
    if (this.hasMoreCommands(line)) {
      this.advance(line)
    }
  }

  hasMoreCommands(line: string) {
    return line.match(COMMAND.A.reg) || line.match(COMMAND.C.reg) || line.match(COMMAND.L.reg)
  }

  advance(line: string) {
    const type = this.commandType(line)
    const symbol = [COMMAND.A.type, COMMAND.L.type].includes(type) ? this.symbol(line, type) : null
  }

  commandType(line: string) {
    const a = line.match(COMMAND.A.reg)
    if (a) {
      return a[1]
    }
    const c = line.match(COMMAND.C.reg)
    if (c) {
      return c[1]
    }
    const l = line.match(COMMAND.L.reg)
    if (a) {
      return l[1]
    }
  }

  symbol(line: string, type: string) {
  }
}
