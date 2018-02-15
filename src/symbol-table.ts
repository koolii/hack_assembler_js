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
    if (this.containes(symbol)) {
      throw new Error('it has already registered symbol table.')
    }
    // this.table[symbol] = Utils.getPaddedBinary(decimalAddr)
    this.table[symbol] = decimalAddr
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

    // P74-P80参照
    // 定義済シンボル
    // ラベルシンボル
    //    (Xxx)と言う疑似コマンドはXxxと言うラベルになる
    // 変数シンボル
    //    順番にメモリに割り当てられ、16から始まる
    // todo 上記の様に区別が必要になってくるので、シンボルがどういうシンボルなのかを判定できなければならない
    // todo ここの処理を全てSymbolTableクラスに移す。がその兼ね合いで、Parser.addvance()の参照がないので
    // Parser.getReader()の時点で既にパースが完了しているものを配列として持っておいたほうが効率が良い
  createTableOnlyFunction(readLine: Function) {
    let funcAddr = 0
    while (true) {
      const parsed: IParser = readLine()
      // this.logger.createTable(JSON.stringify(parsed))
      if (!parsed) {
        break
      }
      // 一応確認する
      if (!parsed.symbol) {
        continue
      }

      // register symbol into SymbolTable
      if (parsed.symbol && constants.COMMAND.L.type === parsed.command && !this.containes(parsed.symbol)) {
        // 疑似コマンドの次のコマンドの位置を参照する
        // これは次の行を表しているのか、0スタートからの次ということで1になるかわかっていないので調査する
        funcAddr += 1
        this.addEntry(parsed.symbol, funcAddr);
      }

      // // 変数か関数呼び出しで、登録するのは変数の方のみ、数字の場合は飛ばす
      // if (constants.COMMAND.A.type === parsed.command && !this.containes(parsed.symbol)) {
      //   const symbol = parsed.symbol
      //   // symbolが数値だった場合
      //   // @100
      //   // M=AでMに100を代入
      //   if (!isNaN(Number(symbol))) {
      //     continue
      //   }
      //   // 変数定義
      //   this.addEntry(symbol, variableAddr);
      //   variableAddr += 1
      // }
    }
  }
}
