import { AsyncTransduceFunction } from "../../transduce/async/type";

export function last<T, K>(tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<K | void> {
    let last: K;
    const [transduce, squeeze] = tf(async (x) => ((last = x), true));

    for await (const x of iter) {
      const continue_ = await transduce(x);

      if (!continue_) {
        return last!;
      }
    }

    await squeeze?.();
    return last!;
  };
}
