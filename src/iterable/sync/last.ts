import { TransduceFunction } from "../../transduce/sync/type";

export function last<T, K>(tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): K | void {
    let last: K;
    const [transduce, squeeze] = tf((x) => ((last = x), true));

    let continue_ = true;
    for (const x of iter) {
      if (!transduce(x)) {
        continue_ = false;
        break;
      }
    }

    squeeze?.(continue_);

    return last!;
  };
}
