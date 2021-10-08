import { AppConfig } from "./app-config"
import { customAlphabet } from "nanoid"

export class App {
  nanoid = customAlphabet("1234567890abcdef", 16)

  config = new AppConfig()
}

export default new App()
