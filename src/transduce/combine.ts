import { conj, Conj } from "./conj";
import { TransduceFunction } from "./type";

type RecurConj<T extends TransduceFunction<any, any>[]> = [...T] extends [
  infer A,
  infer B,
  ...infer Rest
]
  ? A extends TransduceFunction<any, any>
    ? B extends TransduceFunction<any, any>
      ? Rest extends [any, ...any]
        ? Rest extends TransduceFunction<any, any>[]
          ? RecurConj<[Conj<A, B>, ...Rest]>
          : never
        : Conj<A, B>
      : never
    : never
  : never;

export function combine<T extends TransduceFunction<any, any>[]>(
  ...list: [...T]
): RecurConj<T> {
  return list.reduce((r, x) => conj(r, x)) as any;
}
