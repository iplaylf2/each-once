import { TransduceFunction } from "../../transduce/sync/type";

interface Predicate<T> {
  (x: T): boolean;
}

export function every<T, K>(f: Predicate<K>, tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): boolean {
    let every = true;
    const [transduce, squeeze] = tf((x) => f(x) || ((every = false), false));

    let continue_ = true;
    for (const x of iter) {
      if (!transduce(x)) {
        continue_ = false;
        break;
      }
    }

    squeeze?.(continue_);

    return every;
  };
}
