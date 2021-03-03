import { TransduceFunction } from "../../transduce/sync/type";

export function count<T>(tf: TransduceFunction<T, any>) {
  return function (iter: Iterable<T>): number {
    let count = 0;
    const [transduce, dispose] = tf(() => (count++, true));

    let continue_ = true;
    for (const x of iter) {
      if (!transduce(x)) {
        continue_ = false;
        break;
      }
    }

    dispose?.(continue_);

    return count;
  };
}
