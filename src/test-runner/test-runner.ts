import { TestResult } from "../test-runner"
import os from "os"
import util from "util"
import child_process from "child_process"
const exec = util.promisify(child_process.exec)

export class TestRunner {
  info() {
    return {
      pid: process.pid,
      arch: process.arch,
      platform: process.platform,
      cores: os.cpus().length,
    }
  }

  async test(target: string): Promise<TestResult> {
    const t0 = Date.now()
    try {
      // NOTE See the following docs for the use of `exec`:
      //   https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
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
