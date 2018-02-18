import Parser from './parser'
import Code from './code'
import Writer from './writer'
import SymbolTable from './symbol-table'
import { IParser } from './interface'
import Utils from './utils'
import Logger from './logger'
import constants from './constants'

export default class HackAssembler {
  parser: Parser
  code: Code
  writer: Writer
  symbol: SymbolTable
  logger: Logger

  constructor() {
    const filepaths = process.argv.slice(2)

    if (filepaths.length <= 0) {
      throw new Error('need to requrie some asm path')
    }
    // 今は決めで１ファイルのみに対応するようにする
    this.logger = new Logger(HackAssembler)
    this.parser = new Parser(filepaths[0])
    this.writer = new Writer(filepaths[0])
    this.code = new Code()
    this.symbol = new SymbolTable()
  }

  async setup() {
    this.logger.setup('Start setup()')
    // this.symbol.printCurrent()
    await this.parser.readFile()
  }

  before() {
    this.logger.before('Start before()')
    const readLine: Function = this.parser.getReader()
    this.symbol.createTableOnlyFunction(readLine)
  }

  after() {
    this.logger.after(`Check output file: ${this.writer.filepath}`)
  }

  async exec() {
    this.logger.exec('Start exec()')

    this.before()

    await this.writer.remove()
    const readLine: Function = this.parser.getReader()

    // 本当はここに書きたくない
    let variableAddr = 16

    while (true) {
      const parsed: IParser = readLine()
      if (!parsed) {
        break
      }

      switch (parsed.command) {
        case constants.COMMAND.A.type:
          let addr = ''
          const symbol = parsed.symbol
          const move = isNaN(Number(symbol))
          // @iとか@numとか
          // @423423とかは無視する
          this.logger.exec(`[switch] ${JSON.stringify(parsed)}`)

          if (move) {
            // 登録されていない場合は変数を登録する
            if (!this.symbol.containes(symbol)) {
              // 変数をSymbolTableに登録する
              addr = this.symbol.addEntry(symbol, variableAddr)
              variableAddr += 1
            } else {
              // 登録されている場合はSymbolTableからアドレスを取得する
              addr = this.symbol.getAddress(symbol)
            }
          } else {
            addr = Utils.getPaddedBinary(symbol)
          }
          await this.writer.write(addr)
          break
        case constants.COMMAND.C.type:
          const encoded = this.code.compile(parsed)
          await this.writer.write(encoded)
          break
        default:
          break
      }
    }

    this.symbol.printCurrent()
    this.parser.clear()
  }
}
