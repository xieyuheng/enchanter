import * as Loggers from "../loggers"
import Path from "path"
import fs from "fs"
import os from "os"
import util from "util"
import child_process from "child_process"
const exec = util.promisify(child_process.exec)
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
      msg: this.target,
      elapse: this.elapse
    })

    if (this.stdout) {
      console.log(this.stdout)
    }

    if (this.stderr || this.error) {
      ut.logLines([
        `I expect the target program to be ok: ${this.target}, but error occured.`,
      ])

      if (this.stderr) {
        ut.logLines([`  stderr:`, ut.indent(this.stderr, "    ")])
      }

      if (this.error) {
        if (this.error.message) {
          ut.logLines([
            `  error message:`,
            ut.indent(this.error.message, "    "),
          ])
        } else {
          ut.logLines([`  error:`, ut.indent(this.error, "    ")])
        }
      }

      process.exit(1)
    }
  }

  // assertError():
  // snapshot(outputFile: string): void {}
}

export class TestRunner {
  info() {
    const header = ut.colors.bold(ut.colors.green("(info)"))

    console.log(header, {
      pid: process.pid,
      arch: process.arch,
      platform: process.platform,
      cores: os.cpus().length,
    })
  }

  // NOTE See the following docs for the use of `exec`:
  //   https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
  async test(target: string): Promise<TestResult> {
    const t0 = Date.now()
    try {
      const { stdout, stderr } = await exec(target)
      const t1 = Date.now()
      const elapse = t1 - t0
      return new TestResult({ target, stdout, stderr, elapse })
    } catch (error) {
      const t1 = Date.now()
      const elapse = t1 - t0
      const { stdout, stderr } = error as any
      return new TestResult({ target, stdout, stderr, elapse, error })
    }
  }
}
