import { AsyncTransduceFunction } from "../../transduce/async/type";

export function first<T, K>(tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<K | void> {
    let first: K;
    const [transduce, dispose] = tf(async (x) => ((first = x), false));

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await dispose?.(continue_);
    
    return first!;
  };
}
