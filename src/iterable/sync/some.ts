import { TransduceFunction } from "../../transduce/sync/type";

interface Predicate<T> {
  (x: T): boolean;
}

export function some<T, K>(f: Predicate<K>, tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): boolean {
    let some = false;
    const [transduce, squeeze] = tf((x) =>
      f(x) ? ((some = true), false) : true
    );

    let continue_ = true;
    for (const x of iter) {
      if (!transduce(x)) {
        continue_ = false;
        break;
      }
    }

    squeeze?.(continue_);

    return some;
  };
}
