import process from "process"

export function test(description: string, fn: () => Promise<void>): void {
  fn()
    .then(() => {
      console.log(`Ok: ${description}`)
      process.exit()
    })
    .catch((error) => {
      console.error(`Fail: ${description}`)
      console.error(error)
      process.exit(1)
    })
}
