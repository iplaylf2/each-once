import { TransduceFunction } from "../../transduce/sync/type";

export function include<T, K>(v: K, tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): boolean {
    let include = false;
    const [transduce, squeeze] = tf(
      (x) => x !== v || ((include = true), false)
    );

    let continue_ = true;
    for (const x of iter) {
      if (!transduce(x)) {
        continue_ = false;
        break;
      }
    }

    squeeze?.(continue_);

    return include;
  };
}
