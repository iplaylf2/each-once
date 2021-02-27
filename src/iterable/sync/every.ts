import { TransduceFunction } from "../../transduce/sync/type";

interface Predicate<T> {
  (x: T): boolean;
}

export function every<T, K>(f: Predicate<K>, tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): boolean {
    let every = true;
    const [transduce, squeeze] = tf((x) => f(x) || ((every = false), false));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return every;
      }
    }

    squeeze?.();
    return every;
  };
}
