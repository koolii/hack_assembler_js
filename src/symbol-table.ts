import Utils from './utils'
import Logger from './logger'
import constants from './constants'
import { IParser } from './interface'

const AorC: string[] = [constants.COMMAND.A.type, constants.COMMAND.C.type]

export default class SymbolTable {
  logger: Logger
  table: Object
  decimalTable: Object

  constructor() {
    this.logger = new Logger(SymbolTable)
    this.table = {}
    this.decimalTable = {}
    Object.keys(constants.SYMBOL).forEach((key) => {
      this.addEntry(key, constants.SYMBOL[key])
    })
  }

  addEntry(symbol: string, decimalAddr: number|string): string {
    if (this.containes(symbol)) {
      throw new Error('it has already registered symbol table.')
    }
    const result = Utils.getPaddedBinary(decimalAddr)
    this.table[symbol] = result
    this.decimalTable[symbol] = decimalAddr
    return result
  }

  containes(symbol: string) {
    return !!this.table[symbol]
  }

  getAddress(symbol: string) {
    return this.table[symbol]
  }

  printCurrent() {
    this.logger.printCurrent(JSON.stringify(this.table, null, '\t'))
    this.logger.printCurrent(JSON.stringify(this.decimalTable, null, '\t'))
  }

  // P74-P80参照
  // 定義済シンボル
  // ラベルシンボル
  //    (Xxx)と言う疑似コマンドはXxxと言うラベルになる
  // 変数シンボル
  //    順番にメモリに割り当てられ、16から始まる
  // P122の@LOOPは4を表す(100)だった
  // @ENDは18を指しているので、ラベルシンボルの行はインクリメントはせずに、かつ、次の行のアドレス(biary)を返すようにしてあげる
  // ここから次のアドレスというのは何なのかを推測している
  createTableOnlyFunction(readLine: Function) {
    let line = 0
    while (true) {
      const parsed: IParser = readLine()
      if (!parsed) {
        break
      }
      // 一行進める(Lコマンドは関数定義なので一行として換算しない)
      if (AorC.includes(parsed.command)) {
        line += 1
      }
      // 一応確認する
      if (!parsed.symbol) {
        continue
      }

      // register symbol into SymbolTable
      if (parsed.symbol && constants.COMMAND.L.type === parsed.command && !this.containes(parsed.symbol)) {
        // 疑似コマンドの次のコマンドの位置を参照する
        // これは次の行を表しているのか、0スタートからの次ということで1になるかわかっていないので調査する
        // => 0スタートで関数を定義している行は無くなる。カウントされないということを考慮する
        this.addEntry(parsed.symbol, line);
      }
    }
  }
}
