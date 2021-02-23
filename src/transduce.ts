import { TransduceFunction } from "./transduce/type";

export function conj<T, K, R>(
  tf: TransduceFunction<T, K>,
  tail: TransduceFunction<K, R>
): TransduceFunction<T, R> {
  return (yield_, break_) => {
    const next = tail(yield_, break_);
    return tf(next, break_);
  };
}

type Conj<T, K> = T extends TransduceFunction<infer A, infer B>
  ? K extends TransduceFunction<infer C, infer D>
    ? B extends C
      ? TransduceFunction<A, D>
      : never
    : never
  : never;

type RecurConj<T extends TransduceFunction<any, any>[]> = [...T] extends [
  infer A,
  infer B,
  ...infer Rest
]
  ? Rest extends TransduceFunction<any, any>[]
    ? Rest[0] extends TransduceFunction<any, any>
      ? RecurConj<[Conj<A, B>, ...Rest]>
      : Conj<A, B>
    : never
  : never;

export function combine<T extends TransduceFunction<any, any>[]>(
  ...list: [...T]
): RecurConj<T> {
  return list.reduce((r, x) => conj(r, x)) as any;
}
