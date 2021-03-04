import { TransduceFunction } from "../../transduce/sync/type";

interface Action<T> {
  (x: T): void;
}

export function foreach<T, K>(f: Action<K>, tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): void {
    const [transduce, dispose] = tf((x) => (f(x), true));

    let continue_ = true;
    for (const x of iter) {
      if (!transduce(x)) {
        continue_ = false;
        break;
      }
    }

    dispose?.(continue_);
  };
}
