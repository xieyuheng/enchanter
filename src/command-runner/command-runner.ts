import { Command } from "../command"
import { ServiceContainer } from "../service-container"

export abstract class CommandRunner<
  App extends ServiceContainer = ServiceContainer
> {
  abstract app: App
  abstract name: string
  abstract commands: Array<Command<any, any>>
  abstract defaultCommand?: Command<any, any>
  abstract run(): void
}
