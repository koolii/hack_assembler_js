import * as fs from 'fs-extra'
import Logger from './logger'

export default class Writer {
  filepath: string
  logger: Logger

  constructor(filepath: string) {
    this.filepath = filepath.replace('.asm', '.hack')
    this.logger = new Logger(Writer)
  }

  async write(line: string) {
    // this.logger.write(`write line: ${line}`)
    await fs.appendFile(this.filepath, `${line}\n`, { encoding: 'utf-8' })
  }

  async remove() {
    this.logger.remove(this.filepath)
    await fs.remove(this.filepath)
  }
}
