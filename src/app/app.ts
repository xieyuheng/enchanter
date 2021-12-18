import { customAlphabet } from "nanoid"
import * as Loggers from "../loggers"
import { AppConfig } from "./app-config"

export class App {
  nanoid = customAlphabet("1234567890abcdef", 16)
  config = new AppConfig()
  logger = new Loggers.PrettyLogger()
}

export default new App()
