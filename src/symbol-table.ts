import Utils from './utils'
import Logger from './logger'
import constants from './constants'
import { IParser } from './interface'

export default class SymbolTable {
  logger: Logger
  table: Object

  constructor() {
    this.logger = new Logger(SymbolTable)
    this.table = {}
    Object.keys(constants.SYMBOL).forEach((key) => {
      this.addEntry(key, constants.SYMBOL[key])
    })
  }

  addEntry(symbol: string, decimalAddr: number|string) {
    if (!this.containes(symbol)) {
      this.table[symbol] = Utils.getPaddedBinary(decimalAddr)
    }
  }

  containes(symbol: string) {
    return !!this.table[symbol]
  }

  getAddress(symbol: string) {
    return this.table[symbol]
  }

  printCurrent() {
    this.logger.printCurrent(JSON.stringify(this.table))
  }

    // 定義済シンボル
    // ラベルシンボル
    //    (Xxx)と言う疑似コマンドはXxxと言うラベルになる
    // 変数シンボル
    //    順番にメモリに割り当てられ、16から始まる
    // todo 上記の様に区別が必要になってくるので、シンボルがどういうシンボルなのかを判定できなければならない
    // todo ここの処理を全てSymbolTableクラスに移す。がその兼ね合いで、Parser.addvance()の参照がないので
    // Parser.getReader()の時点で既にパースが完了しているものを配列として持っておいたほうが効率が良い
  createTable(readLine: Function) {
    let nextAddr = 1
    while (true) {
      const parsed: IParser = readLine()
      if (!parsed) {
        break
      }
      if (parsed.symbol) {
        // 疑似コマンドの次のコマンドの位置を参照する
        this.addEntry(parsed.symbol, nextAddr);
      }
      nextAddr += 1
    }

    this.printCurrent()
  }
}
