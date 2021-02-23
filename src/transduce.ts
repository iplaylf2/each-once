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
