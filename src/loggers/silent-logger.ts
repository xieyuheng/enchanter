import { Logger, LogOptions } from "../logger"
import * as ut from "../ut"

export class SilentLogger extends Logger {
  log(opts: LogOptions): void {}
}
