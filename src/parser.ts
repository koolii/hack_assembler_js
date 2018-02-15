import * as fs from 'fs-extra'
import { createInterface, ReadLine } from 'readline'
import constants from './constants'
import Logger from './logger'
import { IParser } from './interface'

const { COMMAND } = constants

export default class Parser {
  // readLine: ReadLine
  filepath: string
  log: Logger
  buffer: IParser[]

  constructor(filepath: string) {
    this.filepath = filepath
    this.log = new Logger(Parser)
    this.buffer = []
  }

  // this.filepathに登録されているパスのファイルを読み込む
  readFile() {
    return new Promise((resolve) => {
      const stream: fs.ReadStream = fs.createReadStream(`${__dirname}/${this.filepath}`, 'utf-8')
      const readLine: ReadLine = createInterface({ input: stream })

      readLine
        .on('line', (line) => {
          // remove empty letter and comment part
          const fillOutEmpty = line.replace(/ /g, '')
          const hasCommentCharacter = fillOutEmpty.match('//')
          const formatedLine = !hasCommentCharacter ? fillOutEmpty : fillOutEmpty.substring(0, hasCommentCharacter.index)

          if (formatedLine !== '') {
            this.buffer.push(this.advance(formatedLine))
          }
        })
        .on('close', () => {
          // this.buffer.push(constants.EOF)
          resolve()
        })
    })
  }

  // todo generatorに変えても良いかも（shift()でthis.bufferの中身を捨てたくない）
  advance(line: string) : IParser {
    this.log.advance(JSON.stringify(line))
    // const line: string = this.buffer.shift()
    if (line === constants.EOF || this.hasMoreCommands(line)) {
      return null
    }

    const command = this.commandType(line)
    if (COMMAND.C === command) {
      const parsed = line.match(COMMAND.C.parse)
      // if parts[2|5] is undefined, returns should be null.
      return {
        command: command.type,
        symbol: '',
        dest: parsed[2] || null,
        comp: parsed[3],
        jump: parsed[5] || null,
      }
    }

    return {
      command: command.type,
      symbol: this.symbol(line, command),
      dest: '',
      comp: '',
      jump: '',
    }
  }

  hasMoreCommands(line: string) : boolean {
    return !line && !line.match(COMMAND.A.reg) && !line.match(COMMAND.C.reg) && !line.match(COMMAND.L.reg)
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

  symbol(line: string, command: any) : string {
    const result = line.match(command.reg)
    if (result === null) {
      throw new Error(`[can't parse a line] command: ${command.type}, line: [${line}]`)
    }
    return result[1]
  }

  getReader() : Function {
    const lines = this.buffer.slice(0);
    function* generate() {
      while (lines.length !== 0) {
        yield lines.shift()
      }
    }
    const iterator = generate()
    return () => iterator.next().value
  }

  clear() : void {
    this.buffer = []
    this.filepath = ''
  }
}
