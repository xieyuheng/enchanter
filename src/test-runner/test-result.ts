import fs from "fs"
import Path from "path"
import * as Loggers from "../loggers"
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

  async snapshotError(output: string): Promise<void> {
    this.logger.info({
      tag: "snapshot-error",
      msg: this.target,
      elapse: this.elapse,
      output,
    })

    if (this.stderr || this.error) {
      // NOTE We write snapshot even `stderr` is empty,
      //   this will ensure delete old snapshot after successful run
      await fs.promises.mkdir(Path.dirname(output), { recursive: true })
      await fs.promises.writeFile(output, this.stderr)
    } else {
      this.reportNonError()
      process.exit(1)
    }
  }

  private reportError(): void {
    if (this.stderr || this.error) {
      ut.logLines([
        `I found error in the target program:`,
        ``,
        ut.colors.yellow(`  program:`),
        ``,
        `    ${this.target}`,
        ``,
      ])

      if (this.stderr) {
        ut.logLines([
          ut.colors.yellow(`  stderr:`),
          ``,
          ut.indent(this.stderr, "    "),
        ])
      }
    }
  }

  private reportNonError(): void {
    if (this.stderr || this.error) return

    ut.logLines([
      `I expect to found error in the target program:`,
      ``,
      ut.colors.yellow(`  program:`),
      ``,
      `    ${this.target}`,
      ``,
      `But no error occured.`,
      ``,
    ])

    if (this.stdout) {
      ut.logLines([
        ut.colors.yellow(`  stdout:`),
        ``,
        ut.indent(this.stdout, "    "),
      ])
    }
  }
}
