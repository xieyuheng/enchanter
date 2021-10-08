import * as CommandRunners from "../command-runners"
import * as Commands from "./commands"
import { CommonHelpCommand } from "../commands"

export function run(): void {
  const runner = new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.DefaultCommand(),
    commands: [
      // TODO
      new Commands.TestCommand(),
      new CommonHelpCommand(),
    ],
  })

  runner.run()
}
