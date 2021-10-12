import { ServiceContainer } from "./service-container"

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

const app = new ServiceContainer()

app.bind(Logger, () => new Logger())

app.bind(Resource, (app) => {
  return new DbResource({
    logger: app.create(Logger),
  })
})

console.log(app.create(Logger))
console.log(app.create(Resource))
