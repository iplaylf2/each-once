import { TransduceFunction } from "../../transduce/sync/type";

export function toArray<T, K>(tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): K[] {
    let result: K[] = [];
    const [transduce, squeeze] = tf((x) => (result.push(x), true));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return result;
      }
    }

    squeeze?.();
    return result;
  };
}
