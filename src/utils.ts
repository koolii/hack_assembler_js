const prefix = '0000000000000000'

export default class Utils {
  // 文字列または数値を対象に、10進数を2進数へ変換し、16ビットになるように0で穴埋めする
  static getPaddedBinary(value: number|string) {
    return (prefix + (Number(value).toString(2) + '')).slice(-16)
  }
}
