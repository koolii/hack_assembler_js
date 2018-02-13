import { IParser, ICode } from './interface'
import Logger from './logger'
import constants from './constants'

const { COMMAND, MNEMONIC } = constants

export default class Code {
  logger: Logger

  constructor() {
    this.logger = new Logger(Code)
  }

  compile(parsed: IParser) {
    if (parsed.command !== COMMAND.C.type) {
      return null
    }
    const r: ICode = {
      dest: this.dest(parsed.dest),
      comp: this.comp(parsed.comp),
      jump: this.jump(parsed.jump),
    }
    return '111' + this.getAbit(parsed.comp) + r.dest + r.comp + r.jump
  }

  getAbit(comp: string) {
    return comp.indexOf('M') !== -1 ? 1 : 0
  }

  dest(str: string) {
    return !str ? MNEMONIC.DEST.NONE : MNEMONIC.DEST[str]
  }
  comp(str: string) {
    return MNEMONIC.COMP[str]
  }
  jump(str: string) {
    return !str ? MNEMONIC.JUMP.NONE : MNEMONIC.JUMP[str]
  }
}
