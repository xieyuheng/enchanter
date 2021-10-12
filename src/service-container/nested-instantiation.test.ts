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

const app = new ServiceContainer()

app.bind(Logger, () => new Logger())

app.bind(SessionStore, (app) => {
  return new SessionStore({
    logger: app.create(Logger),
  })
})

app.bind(Service, (app) => {
  return new Service({
    logger: app.create(Logger),
    sessionStore: app.create(SessionStore),
  })
})

console.log(app.create(Logger))
console.log(app.create(SessionStore))
console.log(app.create(Service))
