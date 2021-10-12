import { ServiceProvider } from "../service-provider"
import { Logger } from "../logger"

type Consturctor<T> = {
  new (...args: Array<any>): T
  name: string
}

export class ServiceContainer {
  create: <T, C extends Consturctor<T>>(inputClass: C) => T = (inputClass) => {
    throw new Error(`I can not resolve class: ${inputClass.name}`)
  }

  bind<T1, C1 extends Consturctor<T1>, T extends T1>(
    givenClass: C1,
    factory: (container: ServiceContainer) => T
  ): void {
    const create = this.create

    this.create = <T2, C2 extends Consturctor<T2>>(inputCls: C1 | C2): T2 => {
      return inputCls === givenClass ? factory(this) : (create(inputCls) as any)
    }
  }

  async bootstrap(
    providers: Array<ServiceProvider>,
    opts?: { logger?: Logger }
  ): Promise<void> {
    for (const provider of providers) {
      if (opts?.logger) {
        opts.logger.info({
          tag: "register",
          msg: `${provider.constructor.name}`,
        })
      }
      await provider.register(this)

      if (provider.boot) {
        if (opts?.logger) {
          opts.logger.info({
            tag: "boot",
            msg: `${provider.constructor.name}`,
          })
        }
        await provider.boot(this)
      }
    }
  }
}
