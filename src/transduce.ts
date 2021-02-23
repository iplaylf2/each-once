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

export function combine<T extends TransduceFunction<any, any>[]>(
  ...list: [...T]
) {
  return list.reduce((r, x) => conj(r, x));
}
