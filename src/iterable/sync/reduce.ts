import { TransduceFunction } from "../../transduce/sync/type";

interface ReduceFunction<T, K> {
  (r: K, x: T): K;
}

export function reduce<T, K, R>(
  rf: ReduceFunction<K, R>,
  v: R,
  tf: TransduceFunction<T, K>
) {
  return function (iter: Iterable<T>): R {
    let r = v;
    const [transduce, squeeze] = tf((x) => ((r = rf(r, x)), true));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return r;
      }
    }

    squeeze?.();
    return r;
  };
}
