import { TransduceFunction } from "../../transduce/sync/type";

interface Action<T> {
  (x: T): any;
}

export function foreach<T, K>(f: Action<K>, tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): void {
    const [transduce, squeeze] = tf((x) => f(x) !== false);

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return;
      }
    }

    squeeze?.();
  };
}
