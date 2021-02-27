import { conj, Conj } from "./sync/conj";
import { TransduceFunction } from "./sync/type";

type RecurConj<T extends TransduceFunction<any, any>[]> = [...T] extends [
  infer A,
  ...infer Rest
]
  ? A extends TransduceFunction<any, any>
    ? Rest extends [infer B, ...infer Rest]
      ? B extends TransduceFunction<any, any>
        ? Rest extends TransduceFunction<any, any>[]
          ? RecurConj<[Conj<A, B>, ...Rest]>
          : never
        : never
      : A
    : never
  : never;

export function combine<T extends TransduceFunction<any, any>[]>(
  ...tfs: [...T]
): RecurConj<T> {
  return tfs.reduce((r, x) => conj(r, x)) as any;
}
