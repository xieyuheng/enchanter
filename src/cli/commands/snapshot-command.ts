import { Command } from "../../command"
import { CommandRunner } from "../../command-runner"
import * as Commands from "../commands"
import { TestRunner } from "../../test-runner"
import app from "../../app"
import * as ut from "../../ut"
import Path from "path"
import ty from "@xieyuheng/ty"
import fastGlob from "fast-glob"
import { paramCase } from "change-case"

type Args = { program: string; glob: string }
type Opts = { extern?: string; exclude?: string }

export class SnapshotCommand extends Command<Args, Opts> {
  name = "snapshot"

  description = "Snapshot a program over glob, write output to .out"

  args = { program: ty.string(), glob: ty.string() }
  opts = { extern: ty.optional(ty.string()), exclude: ty.optional(ty.string()) }

  // prettier-ignore
  help(runner: CommandRunner): string {
    return [
      `The ${ut.colors.blue(this.name)} command take a program name, a glob pattern for files,`,
      `and run the program over each file in the files,`,
      `then write output of each result to an output file named '<file>.out'`,
      ``,
      ut.colors.blue(`  ${runner.name} ${this.name} ts-node 'src/**/*.snapshot.ts'`),
      ``,
      `The example above will write output to 'src/**/*.snapshot.ts.out'`,
      ``,
      `Note that, snapshot output file should be checked into source control.`,
      `We can use '--extern <dir>' to specify an external output directory.`,
      ``,
      ut.colors.blue(`  ${runner.name} ${this.name} node 'lib/**/*.snapshot.js' --extern snapshot`),
      ``,
      `Then the output will be written into 'snapshot/<generated-flat-file-name>.out'`,
      ``,
      `The ${ut.colors.blue(this.name)} command also support '--exclude <glob>' option.`,
      ``,
      ut.colors.blue(`  ${runner.name} ${this.name} cic 'tests/**/*.cic' --exclude 'tests/**/*.error.cic'`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const runner = new TestRunner()

    app.logger.info(runner.info())

    const exclude = argv["exclude"] ? await fastGlob(argv["exclude"]) : []
    const files = (await fastGlob(argv["glob"])).filter(
      (file) => !exclude.includes(file)
    )

    if (argv["extern"]) {
      for (const file of files) {
        const result = await runner.test(`${argv["program"]} ${file}`)
        await result.snapshot(argv["extern"] + "/" + paramCase(file) + ".out")
      }
    } else {
      for (const file of files) {
        const result = await runner.test(`${argv["program"]} ${file}`)
        await result.snapshot(file + ".out")
      }
    }
  }
}
