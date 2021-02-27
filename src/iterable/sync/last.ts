import { TransduceFunction } from "../../transduce/sync/type";

export function last<T, K>(tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): K | void {
    let last: K;
    const [transduce, squeeze] = tf((x) => ((last = x), true));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return last!;
      }
    }

    squeeze?.();
    return last!;
  };
}
