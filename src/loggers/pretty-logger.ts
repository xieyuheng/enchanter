import { Logger, LogOptions } from "../logger"
import * as ut from "../ut"

export class PrettyLogger extends Logger {
  log(opts: LogOptions): void {
    const { level, elapse, tag, msg } = opts

    let s = ""

    s += this.formatTime(new Date()) + " "
    s += this.formatLevel(level) + " "

    if (tag) s += this.formatTag(tag) + " "
    if (msg) s += `${msg}`
    if (elapse !== undefined) s += " " + this.formatElapse(elapse)

    s += "\n"

    for (const [key, value] of Object.entries(opts)) {
      if (!["level", "tag", "msg", "elapse"].includes(key)) {
        s += this.formatProperty(key, value)
        s += "\n"
      }
    }

    console.log(s.trim())
  }

  private formatLevel(level: string): string {
    const lv = ut.colors.bold(level.toUpperCase())

    if (level === "info") {
      return ut.colors.blue(lv)
    } else if (level === "error") {
      return ut.colors.red(lv)
    } else {
      return lv
    }
  }

  private formatTime(t: Date): string {
    const time = ut.formatTime(new Date(), { withMilliseconds: true })
    return ut.colors.yellow(`[${time}]`)
  }

  private formatElapse(elapse: number): string {
    return ut.colors.yellow(`<${elapse}ms>`)
  }

  private formatTag(tag: string): string {
    return ut.colors.bold(`(${tag})`)
  }

  private formatProperty(key: string, value: any): string {
    const k = ut.colors.italic(ut.colors.yellow(key))
    const j = JSON.stringify(value, null, 2)
    const v = ut.indent(j, "  ").trim()
    return `  ${k}: ${v}`
  }
}
