import { TransduceFunction } from "../../transduce/sync/type";

interface Action<T> {
  (x: T): any;
}

export function foreach<T, K>(f: Action<K>, tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): void {
    const [transduce, dispose] = tf(f);

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
