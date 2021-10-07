import process from "process"
import * as ut from "../ut"

export function test(description: string, fn: () => Promise<void>): void {
  fn()
    .then(() => {
      const head = ut.colors.blue("Ok")
      console.log(`${head}: ${description}`)
    })
    .catch((error) => {
      const head = ut.colors.red("Fail")
      console.error(`${head}: ${description}`)
      console.error(error)
    })
}
