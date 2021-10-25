import { ServiceProvider } from "../service-provider"
import * as Loggers from "../loggers"
import { Logger } from "../logger"

type Consturctor = {
  new (...args: Array<any>): any
  name: string
}

export class ServiceContainer {
  create<C extends Consturctor>(inputClass: C): InstanceType<C> {
    throw new Error(`I can not resolve class: ${inputClass.name}`)
  }

  bind<C1 extends Consturctor>(
    givenClass: C1,
    factory: (container: ServiceContainer) => InstanceType<C1>
  ): void {
    const create = this.create

    this.create = <C2 extends Consturctor>(
      inputCls: C1 | C2
    ): InstanceType<C2> => {
      return inputCls === givenClass ? factory(this) : (create(inputCls) as any)
    }
  }

  async bootstrap(
    providers: Array<ServiceProvider>,
    opts?: { logger?: Logger }
  ): Promise<void> {
    const logger = opts?.logger || new Loggers.SilentLogger()

    for (const provider of providers) {
      logger.info({ tag: "register", msg: `${provider.constructor.name}` })
      await provider.register(this)
    }

    for (const provider of providers) {
      if (provider.boot) {
        logger.info({ tag: "boot", msg: `${provider.constructor.name}` })
        await provider.boot(this)
      }
    }
  }
}
