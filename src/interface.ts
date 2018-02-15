export interface IParser {
  command: string
  dest: string|null
  comp: string|null
  jump: string|null
  symbol: string|null
}
export interface ICode {
  dest: string
  comp: string
  jump: string
}
export abstract class CCommand {
  dest: string
  comp: string
  jump: string
  get() { return this.dest + this.comp + this.jump }
}
export interface ILine {
  line: string
  command: string
  symbol: string
  dest: string
  comp: string
  jump: string
}
