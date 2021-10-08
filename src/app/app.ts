import { AppConfig } from "./app-config"
import * as Loggers from "../loggers"
import { customAlphabet } from "nanoid"

export class App {
  nanoid = customAlphabet("1234567890abcdef", 16)
  config = new AppConfig()
  logger = new Loggers.PrettyLogger()
}

export default new App()
