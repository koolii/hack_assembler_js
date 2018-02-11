import Parser from './parser'
import Logger from './logger'

export default class HackAssembler {
  parser: Parser
  log: Logger

  constructor() {
    this.log = new Logger(HackAssembler)
    this.parser = new Parser(process.argv[2])
  }

  async setup() {
    this.log.setup('Start setup()')
    await this.parser.readFile()
  }

  async exec() {
    this.log.setup('Start exec()')

    while (1) {
      const parsed = this.parser.advance()
      if (!parsed) break
      this.log.exec(JSON.stringify(parsed))
    }
  }
}
