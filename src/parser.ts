import * as fs from 'fs-extra'
import { createInterface, ReadLine } from 'readline'

const COMMAND = {
  // A_COMMAND: @Xxxを表し、Xxxはシンボルか10進数の数
  A: {
    reg: /@(\w+)/,
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
      // console.log(`[coming a line]: ${line}`)
      const formatedLine = this.cutTrash(line)
      this.parse(formatedLine)
    })

    this.readLine = readLine;
  }

  parse(line: string) {
    if (this.hasMoreCommands(line)) {
      // console.log(`[matched]`)
      this.advance(line)
    } else {
      console.log(`[skip no meaning line]: ${line}`)
    }
  }

  cutTrash(plainLine: string) {
    const fillOutEmpty = plainLine.replace(/ /g, '')
    // 行の後ろに記述してあるコメント(//以降)を削除する実装をする必要がある
    // 無意味な空白を削除する必要がある
    const hasCommentCharacter = fillOutEmpty.match('//')
    const line = !hasCommentCharacter ? plainLine : plainLine.substring(0, hasCommentCharacter.index)

    console.log(`[cutTrash] ${line}`)

    return line
  }

  hasMoreCommands(line: string) {
    return line.match(COMMAND.A.reg) || line.match(COMMAND.C.reg) || line.match(COMMAND.L.reg)
  }

  advance(line: string) {
    const command = this.commandType(line)
    const symbol = COMMAND.C === command ? null : this.symbol(line, command)

    if (!symbol) {
      console.log(`[symbol] this command is type C. [${line}]`)
    }
  }

  commandType(line: string) {
    const a = line.match(COMMAND.A.reg)
    if (a) {
      return COMMAND.A
    }
    const c = line.match(COMMAND.C.reg)
    if (c) {
      return COMMAND.C
    }
    const l = line.match(COMMAND.L.reg)
    if (l) {
      return COMMAND.L
    }
  }

  symbol(line: string, command: any) {
    console.log(`[symbol] command: ${JSON.stringify(command)}, line: ${line}`)

    const result = line.match(command.reg)
    if (result === null) {
      throw new Error(`[can't parse a line] command: ${command.type}, line: ${line}`)
    }
    // console.log(`TYPE: ${command.type}, reuslt: ${JSON.stringify(result)}`)
    return result[1]
  }
}
