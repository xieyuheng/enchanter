import os from "os"
import * as ut from "../ut"

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

  run(): void {
    require("./exit-on-unhandled-rejection")
  }
}
