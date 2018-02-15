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

  async before() {
    this.logger.before('Start before()')
    // create symbol table
    const readLine: Function = this.parser.getReader()

    // 定義済シンボル
    // ラベルシンボル
    //    (Xxx)と言う疑似コマンドはXxxと言うラベルになる
    // 変数シンボル
    //    順番にメモリに割り当てられ、16から始まる
    // todo 上記の様に区別が必要になってくるので、シンボルがどういうシンボルなのかを判定できなければならない
    // todo ここの処理を全てSymbolTableクラスに移す。がその兼ね合いで、Parser.addvance()の参照がないので
    // Parser.getReader()の時点で既にパースが完了しているものを配列として持っておいたほうが効率が良い
    let nextAddr = 1
    while (true) {
      const parsed: IParser = this.parser.advance(readLine())
      this.logger.before(JSON.stringify(parsed))
      if (!parsed) {
        break
      }
      if (parsed.symbol) {
        // 疑似コマンドの次のコマンドの位置を参照する
        this.symbol.addEntry(parsed.symbol, nextAddr);
      }
      nextAddr += 1
    }

    this.symbol.printCurrent()
  }

  async exec() {
    this.logger.exec('Start exec()')

    this.before()

    await this.writer.remove()
    const readLine: Function = this.parser.getReader()

    while (true) {
      const parsed: IParser = this.parser.advance(readLine())
      if (!parsed) {
        break
      }

      switch (parsed.command) {
        case constants.COMMAND.A.type:
          // symbolはまずは無視して、只単純にバイナリに変更を行なう
          await this.writer.write(Utils.getPaddedBinary(parsed.symbol))
          break
        case constants.COMMAND.C.type:
          // this.logger.exec(JSON.stringify(parsed))
          const encoded = this.code.compile(parsed)
          await this.writer.write(encoded)
          break
        default:
          break
      }
    }

    this.parser.clear()
  }
}
