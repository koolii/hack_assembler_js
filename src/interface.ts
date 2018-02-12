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
