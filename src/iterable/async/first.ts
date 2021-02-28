import { AsyncTransduceFunction } from "../../transduce/async/type";

export function first<T, K>(tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<K | void> {
    let first: K;
    const [transduce, squeeze] = tf(async (x) => ((first = x), false));

    for await (const x of iter) {
      const continue_ = await transduce(x);

      if (!continue_) {
        return first!;
      }
    }

    await squeeze?.();
    return first!;
  };
}
