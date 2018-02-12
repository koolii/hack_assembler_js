import Parser from './parser'
import Code from './code'
import Writer from './writer'
import { IParser } from './interface'
import Logger from './logger'
import contents from './constants'

export default class HackAssembler {
  parser: Parser
  code: Code
  writer: Writer
  logger: Logger

  constructor() {
    this.logger = new Logger(HackAssembler)
    this.parser = new Parser(process.argv[2])
    this.writer = new Writer(process.argv[2])
    this.code = new Code()
  }

  async setup() {
    this.logger.setup('Start setup()')
    await this.parser.readFile()
  }

  async exec() {
    this.logger.setup('Start exec()')

    await this.writer.remove()

    while (1) {
      const parsed: IParser = this.parser.advance()
      if (!parsed) break
      // this.logger.exec(JSON.stringify(parsed))

      const encoded = this.code.compile(parsed)
      if (encoded) {
        await this.writer.write(encoded)
        continue
      } else if (parsed.command === contents.COMMAND.A.type) {
        // symbolはまずは無視して、只単純にバイナリに変更を行なう
        const binary = Number(parsed.symbol).toString(2)
        const paddedBinary = ('0000000000000000' + binary).slice(-16)
        await this.writer.write(paddedBinary)
      }
    }
  }
}
