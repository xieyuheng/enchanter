import { Logger } from "../logger"
import * as ut from "../ut"

export class SilentLogger extends Logger {
  info(input: string | Record<string, any>): void {}
  error(input: string | Record<string, any>): void {}
  log(opts: {
    level: string
    elapse?: number
    tag?: string
    msg?: string
  }): void {}
}
