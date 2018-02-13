import Parser from './parser'
import Code from './code'
import Writer from './writer'
import { IParser } from './interface'
import Logger from './logger'
import constants from './constants'

export default class HackAssembler {
  parser: Parser
  code: Code
  writer: Writer
  logger: Logger

  constructor() {
    const filepaths = process.argv.slice(2)
    // 今は決めで１ファイルのみに対応するようにする
    this.logger = new Logger(HackAssembler)
    this.parser = new Parser(filepaths[0])
    this.writer = new Writer(filepaths[0])
    this.code = new Code()
  }

  async setup() {
    this.logger.setup('Start setup()')
    await this.parser.readFile()
  }

  async exec() {
    this.logger.exec('Start exec()')

    await this.writer.remove()

    while (true) {
      const parsed: IParser = this.parser.advance()
      if (!parsed) {
        break
      }

      switch (parsed.command) {
        case constants.COMMAND.A.type:
          // symbolはまずは無視して、只単純にバイナリに変更を行なう
          const binary = Number(parsed.symbol).toString(2)
          const paddedBinary = ('0000000000000000' + binary).slice(-16)
          await this.writer.write(paddedBinary)
          break
        case constants.COMMAND.C.type:
          // this.logger.exec(JSON.stringify(parsed))
          // todo なぜか17文字になってる箇所がある
          const encoded = this.code.compile(parsed)
          await this.writer.write(encoded)
          break
        default:
          break
      }
    }
  }
}
