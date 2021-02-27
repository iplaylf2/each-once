import { TransduceFunction } from "../../transduce/sync/type";

export function count<T, K>(tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): number {
    let count = 0;
    const [transduce, squeeze] = tf(() => (count++, true));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return count;
      }
    }

    squeeze?.();
    return count;
  };
}
