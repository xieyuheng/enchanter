import * as Loggers from "../loggers"
import Path from "path"
import fs from "fs"
import * as ut from "../ut"

export class TestResult {
  target: string
  stdout: string
  stderr: string
  elapse: number
  error?: any

  logger = new Loggers.PrettyLogger()

  constructor(opts: {
    target: string
    stdout: string
    stderr: string
    elapse: number
    error?: any
  }) {
    this.target = opts.target
    this.stdout = opts.stdout
    this.stderr = opts.stderr
    this.elapse = opts.elapse
    this.error = opts.error
  }

  private reportError(): void {
    if (this.stderr || this.error) {
      ut.logLines([
        `I found error in the program:`,
        ``,
        `  target program: ${this.target}`,
        ``,
      ])

      if (this.stderr) {
        ut.logLines([
          //
          `  stderr:`,
          ``,
          ut.indent(this.stderr, "    "),
        ])
      }

      if (this.error) {
        if (this.error.message) {
          ut.logLines([
            `  error message:`,
            ``,
            ut.indent(this.error.message, "    "),
          ])
        } else {
          ut.logLines([
            //
            `  error:`,
            ``,
            ut.indent(this.error, "    "),
          ])
        }
      }
    }
  }

  assertOk(): void {
    this.logger.info({
      tag: "ok",
      msg: this.target,
      elapse: this.elapse,
    })

    if (this.stdout) {
      console.log(this.stdout)
    }

    if (this.stderr || this.error) {
      this.reportError()
      process.exit(1)
    }
  }

  async snapshot(output: string): Promise<void> {
    this.logger.info({
      tag: "snapshot",
      msg: this.target,
      elapse: this.elapse,
      output,
    })

    if (this.stderr || this.error) {
      this.reportError()
      process.exit(1)
    }

    // NOTE We write snapshot even `stdout` is empty,
    //   this will ensure delete old snapshot after successful run
    await fs.promises.mkdir(Path.dirname(output), { recursive: true })
    await fs.promises.writeFile(output, this.stdout)
  }

  snapshotError(): void {
    throw new Error("TODO")
  }
}
