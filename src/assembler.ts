import Parser from './parser'
import Code from './code'
import { IParser } from './interface'
import Logger from './logger'
import contents from './constants'

export default class HackAssembler {
  parser: Parser
  code: Code
  logger: Logger

  constructor() {
    this.logger = new Logger(HackAssembler)
    this.parser = new Parser(process.argv[2])
    this.code = new Code()
  }

  async setup() {
    this.logger.setup('Start setup()')
    await this.parser.readFile()
  }

  async exec() {
    this.logger.setup('Start exec()')

    while (1) {
      const parsed: IParser = this.parser.advance()
      if (!parsed) break
      this.logger.exec(JSON.stringify(parsed))

      const encoded = this.code.compile(parsed)
      if (encoded) {
        this.logger.exec(JSON.stringify(encoded))
      }

    }
  }
}
