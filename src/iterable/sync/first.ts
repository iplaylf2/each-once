import { TransduceFunction } from "../../transduce/sync/type";

export function first<T, K>(tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): K | void {
    let first: K;
    const [transduce, squeeze] = tf((x) => ((first = x), false));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return first!;
      }
    }

    squeeze?.();
    return first!;
  };
}
