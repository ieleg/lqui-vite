import { json } from "stream/consumers"

export type Expect<T extends true> = T
export type ExpectTrue<T extends true> = T
export type ExpectFalse<T extends false> = T
export type IsTrue<T extends true> = T
export type IsFalse<T extends false> = T

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsAny<T> = 0 extends (1 & T) ? true : false
export type NotAny<T> = true extends IsAny<T> ? false : true

export type Debug<T> = { [K in keyof T]: T[K] }
export type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>

export type ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE ? true : false
export type ExpectValidArgs<FUNC extends (...args: any[]) => any, ARGS extends any[]> = ARGS extends Parameters<FUNC>
  ? true
  : false

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type MyPick<T, K extends keyof T> = {
  [P in K]:  T[P]
}
/* _____________ Test Cases _____________ */
type cases5 = [
  Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
  Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>,
  MyPick<Todo, 'title' | 'completed' | 'invalid'>,
]

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
}

interface Expected2 {
  title: string
  completed: boolean
}

type MyReadonly<T> = { 
  readonly [P in keyof T]:  T[P]
}

type cases4 = [
  Expect<Equal<MyReadonly<Todo1>, Readonly<Todo1>>>,
]

interface Todo1 {
  title: string
  description: string
  completed: boolean
  meta: {
    author: string
  }
}

type TupleToObject<T extends readonly any[]> = any

type First<T extends any[]> = T extends [infer P, ...any[]] ? P : never



type cases3 = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>,
]

//   创建一个通用的`Length`，接受一个`readonly`的数组，返回这个数组的长度。
type Length<T extends readonly any[]> = T['length']


/* _____________ 测试用例 _____________ */
const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const
const spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'] as const

type cases2 = [
  Expect<Equal<Length<typeof tesla>, 4>>,
  Expect<Equal<Length<typeof spaceX>, 5>>,
  Length<5>,
  Length<'hello world'>,
]


//  实现内置的Exclude <T, U>类型，但不能直接使用它本身。
// 从联合类型T中排除U的类型成员，来构造一个新的类型。
type MyExclude<T, U> = T extends U ? never : T;
type cases45 = [
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a'>, Exclude<'a' | 'b' | 'c', 'a'>>>,
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a' | 'b'>, Exclude<'a' | 'b' | 'c', 'a' | 'b'>>>,
  Expect<Equal<MyExclude<string | number | (() => void), Function>, Exclude<string | number | (() => void), Function>>>,
]

// 假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 Promise<T> 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。
type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T;

// 实现一个 `IF` 类型，它接收一个条件类型 `C` ，一个判断为真时的返回类型 `T` ，以及一个判断为假时的返回类型 `F`。 `C` 只能是 `true` 或者 `false`， `T` 和 `F` 可以是任意类型。

type If<C, T, F> = C extends true ? T : F;

// 实现内置的concat
type Concat<T extends any[], U extends any[]> = [...T, ...U]

// 在类型系统里实现 JavaScript 的 `Array.includes` 方法，这个类型接受两个参数，返回的类型要么是 `true` 要么是 `false`。

type Includes<T extends readonly any[], U> = T extends [infer F, ...infer R] 
 ? Equal<U, F> extends true 
 ? true
 : Includes<R, U> : false;

 type cases = [
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>, true>>,
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>, false>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 7>, true>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 4>, false>>,
  Expect<Equal<Includes<[1, 2, 3], 2>, true>>,
  Expect<Equal<Includes<[1, 2, 3], 1>, true>>,
  Expect<Equal<Includes<[{}], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[boolean, 2, 3, 5, 6, 7], false>, false>>,
  Expect<Equal<Includes<[true, 2, 3, 5, 6, 7], boolean>, false>>,
  Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>>,
  Expect<Equal<Includes<[{ a: 'A' }], { readonly a: 'A' }>, false>>,
  Expect<Equal<Includes<[{ readonly a: 'A' }], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[1], 1 | 2>, false>>,
  Expect<Equal<Includes<[1 | 2], 1>, false>>,
  Expect<Equal<Includes<[null], undefined>, false>>,
  Expect<Equal<Includes<[undefined], null>, false>>,
]

//在类型系统里实现通用的 ```Array.push``` 。
type Push<T extends any[], U> = [...T, U];

//实现内置的 Parameters<T> 类型，而不是直接使用它，可参考[TypeScript官方文档](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)。
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer R) => any ? R : never;

// 不使用 `ReturnType` 实现 TypeScript 的 `ReturnType<T>` 泛型。
type MyReturnType<T> = T extends (...args: any[]) => infer R ?  R : never;


interface Todo {
  title: string
  description: string
  completed: boolean
}
// 实现omit
type MyOmit<T extends Record<string, any>, K> = {
  [P in Exclude<keyof T,K>] : T[P]
}
type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}

/* 实现一个通用`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。
  
`K`指定应设置为Readonly的`T`的属性集。如果未提供`K`，则应使所有属性都变为只读，就像普通的`Readonly<T>`一样。 */
type MyReadonly2<T, K=any> = T & {
  readonly[key in keyof T as key extends K ? key : never]: T[key]
}

interface Todo12 {
  title: string
  description?: string
  completed: boolean
}
type fdd = MyReadonly2<Todo12>

// type Arr = ['1', '2', '3']
// type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
type TupleToUnion<T extends readonly any[]> = T[number]


/*
  12 - 可串联构造器
  -------
  by Anthony Fu (@antfu) #中等 #application
  
  ### 题目
  
  在 JavaScript 中我们很常会使用可串联（Chainable/Pipeline）的函数构造一个对象，但在 TypeScript 中，你能合理的给他附上类型吗？
  
  在这个挑战中，你可以使用任意你喜欢的方式实现这个类型 - Interface, Type 或 Class 都行。你需要提供两个函数 `option(key, value)` 和 `get()`。在 `option` 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 `get` 获取最终结果。
  
  例如
  
  ```ts
  declare const config: Chainable
  
  const result = config
    .option('foo', 123)
    .option('name', 'type-challenges')
    .option('bar', { value: 'Hello World' })
    .get()
  
  // 期望 result 的类型是：
  interface Result {
    foo: number
    name: string
    bar: {
      value: string
    }
  }
  ```
  
  你只需要在类型层面实现这个功能 - 不需要实现任何 TS/JS 的实际逻辑。
  
  你可以假设 `key` 只接受字符串而 `value` 接受任何类型，你只需要暴露它传递的类型而不需要进行任何处理。同样的 `key` 只会被使用一次。
  
  > 在 Github 上查看：https://tsch.js.org/12/zh-CN
*/
type Chainable<T extends object = {}> = {
  option<K extends number | string, S>(key: K, value: S): Chainable<T & {[k in K]: S}>
  get(): T
}


// type arr1 = ['a', 'b', 'c']
// type arr2 = [3, 2, 1]

// type tail1 = Last<arr1> // expected to be 'c'
// type tail2 = Last<arr2> // expected to be 1
type Last<T extends any[]> = T extends [...infer r, infer L] ? L : never

[1,2,3, '123'].pop()


// type arr1 = ['a', 'b', 'c', 'd']
// type arr2 = [3, 2, 1]

// type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
// type re2 = Pop<arr2> // expected to be [3, 2]
type Pop<T extends any[]> = T extends [...infer R, infer L] ? R : never


declare function PromiseAll<T extends any[]>(values: [...T]): Promise<{[P in keyof T]: T[P] extends Promise<infer R> ? R : T[P]}>
let d = PromiseAll([1,2,3])


// interface Cat {
//   type: 'cat'
//   breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
// }

// interface Dog {
//   type: 'dog'
//   breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
//   color: 'brown' | 'white' | 'black'
// }

// type MyDog = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
type LookUp<U , T> = U extends {type: T} ? U : never

type sss = '  dasd  '
type trim<T> = T extends `${' '|'\n'|'\t'}${infer R}` | `${infer R}${' '|'\n'|'\t'}` ? trim<R> : T
type asd = trim<sss>


type MyCapitalize<S extends string> = S extends `${infer R}${infer T}` ? `${Uppercase<R>}${T}` : S
type _dad = MyCapitalize<'dasd'>


const daxx = 'asd'.replace('s', 'ddx')


type AppendArgument<Fn, A> = Fn extends (...arg: infer R) => infer T ? (...arg:[...R, A]) => T : never



// 全排列
type _sad = '123' | 'asd'
type Permutation<T, K=T> = [T] extends [never]
  ? []
  : K extends T
    ? [K, ...Permutation<Exclude<T, K>>]
    : never
    
type _dsd = Exclude<_sad, '123' | 'asd'>
type _dsd1 = Permutation<_sad>

let dadsxx = [...[]]


// type Test = { id: '1' }
// type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
type AppendToObject<T extends {}, U extends string, V> = {[key in (keyof T) | U]: key extends keyof T ? T[key] : V }


JSON
