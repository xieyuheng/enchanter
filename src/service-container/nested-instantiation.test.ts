import { ServiceContainer } from "./service-container"

class Logger {
  instanceofLogger = true

  log(msg: string): void {
    console.log(msg)
  }
}

class SessionStore {
  instanceofSessionStore = true

  logger: Logger

  constructor(opts: { logger: Logger }) {
    this.logger = opts.logger
  }
}

class Service {
  instanceofService = true

  logger: Logger
  sessionStore: SessionStore

  constructor(opts: { logger: Logger; sessionStore: SessionStore }) {
    this.logger = opts.logger
    this.sessionStore = opts.sessionStore
  }
}

const container = new ServiceContainer()

container.bind(Logger, () => new Logger())

container.bind(SessionStore, ({ create }) => {
  return new SessionStore({
    logger: create(Logger),
  })
})

container.bind(Service, ({ create }) => {
  return new Service({
    logger: create(Logger),
    sessionStore: create(SessionStore),
  })
})

console.log(container.create(Logger))
console.log(container.create(SessionStore))
console.log(container.create(Service))
