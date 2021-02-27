import { TransduceFunction } from "../../transduce/sync/type";

export function count<T>(tf: TransduceFunction<T, any>) {
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
