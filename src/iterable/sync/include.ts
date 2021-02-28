import { TransduceFunction } from "../../transduce/sync/type";

export function include<T, K>(v: K, tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): boolean {
    let include = false;
    const [transduce, squeeze] = tf(
      (x) => x !== v || ((include = true), false)
    );

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return include;
      }
    }

    squeeze?.();
    return include;
  };
}
