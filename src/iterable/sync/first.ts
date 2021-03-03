import { TransduceFunction } from "../../transduce/sync/type";

export function first<T, K>(tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): K | void {
    let first: K;
    const [transduce, dispose] = tf((x) => ((first = x), false));

    let continue_ = true;
    for (const x of iter) {
      if (!transduce(x)) {
        continue_ = false;
        break;
      }
    }

    dispose?.(continue_);

    return first!;
  };
}
