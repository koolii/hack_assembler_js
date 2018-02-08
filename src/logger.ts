const red = '\u001b[31m'
const green = '\u001b[32m'
const yellow = '\u001b[33m'
const blue = '\u001b[34m'
const magenta = '\u001b[35m'
const cyan = '\u001b[36m'
const white = '\u001b[37m'

const reset = '\u001b[0m'

export default class Logger {
  class: string

  constructor(classname: string) {
    this.class = classname
  }

  info(method: string, str: any) {
    console.log(`${red}[${this.class}] ${yellow}[${method}] ${cyan}${str}${reset}`)
  }
}
