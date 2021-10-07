import * as ut from "../ut"

export function assert(x: boolean): void {
  if (!x) {
    throw new Error("I fail to assert true")
  }
}

export function assertEqual(x: any, y: any): void {
  if (!ut.equal(x, y)) {
    throw new Error(
      [
        "I fail to assert equal, the following two values are not equal.",
        `x: ${JSON.stringify(x)}`,
        `y: ${JSON.stringify(y)}`,
      ].join("\n")
    )
  }
}

export function assertNotEqual(x: any, y: any): void {
  if (ut.equal(x, y)) {
    throw new Error(
      [
        "I fail to assert not equal, the following two values are equal.",
        `x: ${JSON.stringify(x)}`,
        `y: ${JSON.stringify(y)}`,
      ].join("\n")
    )
  }
}
