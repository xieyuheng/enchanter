type Consturctor<T> = {
  new (...args: Array<any>): T
  name: string
}

export class Container {
  create: <T, C extends Consturctor<T>>(inputClass: C) => T = (inputClass) => {
    throw new Error(`I can not resolve class: ${inputClass.name}`)
  }

  bind<T1, C1 extends Consturctor<T1>, T extends T1>(
    givenClass: C1,
    factory: (container: Container) => T
  ): void {
    const resolve = this.create

    this.create = <T2, C2 extends Consturctor<T2>>(inputCls: C1 | C2): T2 => {
      return inputCls === givenClass
        ? factory(this)
        : (resolve(inputCls) as any)
    }
  }
}
