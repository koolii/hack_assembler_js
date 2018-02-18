import * as fs from 'fs-extra'
import Logger from './logger'
import constants from './constants'

export default class Writer {
  filepath: string
  logger: Logger

  constructor(filepath: string) {
    this.filepath = `hack/${filepath.replace(constants.ASM_FILE, constants.HACK_FILE)}`
    this.logger = new Logger(Writer)
    this.logger.remove(this.filepath)
  }

  async write(line: string) {
    await fs.appendFile(this.filepath, `${line}\n`, { encoding: 'utf-8' })
  }

  async remove() {
    const result = await fs.pathExists(this.filepath)
    if (result) {
      this.logger.remove(this.filepath)
      await fs.remove(this.filepath)
    } else {
      await fs.createFile(this.filepath)
    }
  }
}
