import Path from "path"
import fs from "fs"
import os from "os"
import util from "util"
import child_process from "child_process"
const exec = util.promisify(child_process.exec)
import * as ut from "../ut"

export class TestResult {
  program: string
  stdout: string
  stderr: string
  elapse: number
  error?: Error

  constructor(opts: {
    program: string
    stdout: string
    stderr: string
    elapse: number
    error?: Error
  }) {
    this.program = opts.program
    this.stdout = opts.stdout
    this.stderr = opts.stderr
    this.elapse = opts.elapse
    this.error = opts.error
  }

  assertOk(): void {
    if (this.stdout) {
      console.log(this.stdout)
    }

    if (this.stderr || this.error) {
      ut.lines([
        `I expect the program to be ok: ${this.program}, but error occured.`,
      ])

      if (this.stderr) {
        ut.lines([`  stderr:`, ut.indent(this.stderr, "    ")])
      }

      if (this.error) {
        ut.lines([`  error message:`, ut.indent(this.error.message, "    ")])
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
  async test(program: string): Promise<TestResult> {
    const t0 = Date.now()
    try {
      const { stdout, stderr } = await exec(program)
      const t1 = Date.now()
      const elapse = t1 - t0
      return new TestResult({
        program,
        stdout,
        stderr,
        elapse,
      })
    } catch (error) {
      const t1 = Date.now()
      const elapse = t1 - t0
      const { stdout, stderr } = error as any
      return new TestResult({
        program,
        stdout,
        stderr,
        elapse,
        error: error as any,
      })
    }
  }
}
