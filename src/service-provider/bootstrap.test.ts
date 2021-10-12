import { ServiceContainer } from "../service-container"
import { ServiceProvider } from "../service-provider"
import { App } from "./example-app"
import * as Providers from "./example-providers"
import { Logger, Resource } from "./example-providers"
import * as ut from "../ut"

const app = new App()

const providers = [
  new Providers.LoggerProvider(),
  new Providers.DbResourceProvider(),
]

async function bootstrap(
  app: App,
  providers: Array<ServiceProvider>
): Promise<void> {
  for (const provider of providers) {
    await provider.register(app)
    await provider.boot(app)
  }
}

ut.test("bootstrap", async () => {
  await bootstrap(app, providers)

  console.log(app.create(Logger))
  console.log(app.create(Resource))
})
