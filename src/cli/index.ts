import * as CommandRunners from "../command-runners"
import * as Commands from "./commands"
import { CommonHelpCommand } from "../commands"

export function run(): void {
  const runner = new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.DefaultCommand(),
    commands: [
      new Commands.TestCommand(),
      new Commands.SnapshotCommand(),
      new Commands.SnapshotErrorCommand(),
      new CommonHelpCommand(),
    ],
  })

  runner.run()
}
