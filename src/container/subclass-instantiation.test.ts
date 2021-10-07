import { Container } from "./container"

class Logger {
  instanceofLogger = true

  log(msg: string): void {
    console.log(msg)
  }
}

class Resource {
  instanceofResource = true

  logger: Logger

  constructor(opts: { logger: Logger }) {
    this.logger = opts.logger
  }
}

class DbResource extends Resource {
  instanceofDbResource = true

  logger: Logger

  constructor(opts: { logger: Logger }) {
    super(opts)
    this.logger = opts.logger
  }
}

const container = new Container()

container.bind(Logger, () => new Logger())

container.bind(Resource, ({ create }) => {
  return new DbResource({
    logger: create(Logger),
  })
})

console.log(container.create(Logger))
console.log(container.create(Resource))
