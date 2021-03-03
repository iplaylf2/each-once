import { AsyncTransduceFunction } from "../../transduce/async/type";

export function last<T, K>(tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<K | void> {
    let last: K;
    const [transduce, dispose] = tf(async (x) => ((last = x), true));

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await dispose?.(continue_);
    
    return last!;
  };
}
