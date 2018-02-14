import Logger from './logger'
import constants from './constants'

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

  addEntry(symbol: string, decimalAddr: number) {
    if (!this.containes(symbol)) {
      this.table[symbol] = decimalAddr
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
}
