import * as fs from 'fs-extra'
import { createInterface, ReadLine } from 'readline'
import constants from './constants'
import Logger from './logger'

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
    parse: /((.+)=)?([^;]+)(;(.+))?/,
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
  log: Logger

  constructor(filepath: string) {
    this.filepath = filepath
    this.log = new Logger(Parser)
  }

  load() {
    const stream: fs.ReadStream = fs.createReadStream(`${__dirname}/${this.filepath}`, 'utf-8')
    const readLine: ReadLine = createInterface({ input: stream })

    readLine.on('line', (line) => {
      const formatedLine = this.cutTrash(line)
      if (formatedLine !== '') {
        this.parse(formatedLine)
      }
    })

    this.readLine = readLine;
  }

  parse(line: string) {
    if (this.hasMoreCommands(line)) {
      this.advance(line)
    } else {
      this.log.parse(`[skip no meaning line]: ${line}`)
    }
  }

  cutTrash(plainLine: string) {
    // remove empty letter and comment part
    const fillOutEmpty = plainLine.replace(/ /g, '')
    const hasCommentCharacter = fillOutEmpty.match('//')
    return !hasCommentCharacter ? fillOutEmpty : fillOutEmpty.substring(0, hasCommentCharacter.index)
  }

  hasMoreCommands(line: string) {
    return line.match(COMMAND.A.reg) || line.match(COMMAND.C.reg) || line.match(COMMAND.L.reg)
  }

  advance(line: string) {
    const command = this.commandType(line)

    if (COMMAND.C === command) {
      const parsed = line.match(COMMAND.C.parse)
      // if parts[2|5] is undefined, returns should be null.
      const result = {
        command: command.type,
        dest: parsed[2] || null,
        comp: parsed[3],
        jump: parsed[5] || null,
      }
      this.log.advance(`this command is type C. [result: ${JSON.stringify(result)}]`)
      return result
    }

    const result = {
      command: command.type,
      symbol: this.symbol(line, command),
    }
    this.log.advance(`this command is type A or L. [${JSON.stringify(result)}]`)

    return result
  }

  commandType(line: string) {
    if (line.match(COMMAND.A.reg)) {
      return COMMAND.A
    }
    if (line.match(COMMAND.C.reg)) {
      return COMMAND.C
    }
    if (line.match(COMMAND.L.reg)) {
      return COMMAND.L
    }
  }

  symbol(line: string, command: any) {
    this.log.symbol(`command: ${command.type}, line: [${line}]`)

    const result = line.match(command.reg)
    if (result === null) {
      throw new Error(`[can't parse a line] command: ${command.type}, line: [${line}]`)
    }
    return result[1]
  }
}
