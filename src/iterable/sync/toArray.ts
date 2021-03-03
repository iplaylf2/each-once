import { TransduceFunction } from "../../transduce/sync/type";

export function toArray<T, K>(tf: TransduceFunction<T, K>) {
  return function (iter: Iterable<T>): K[] {
    let result: K[] = [];
    const [transduce, dispose] = tf((x) => (result.push(x), true));

    let continue_ = true;
    for (const x of iter) {
      if (!transduce(x)) {
        continue_ = false;
        break;
      }
    }

    dispose?.(continue_);

    return result;
  };
}
