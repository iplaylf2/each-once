import { combine } from "./transduce/combine";
import { flatten, map } from "./transduce/function/sync";

export * from "./transduce";
export * from "./transduce/function/sync";
export * from "./iterable/sync";

const foo=combine(map((x:number)=>[x]),flatten<number>())