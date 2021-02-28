import { AsyncTransduceFunction } from "../../transduce/async/type";

export function toArray<T, K>(tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<K[]> {
    let result: K[] = [];
    const [transduce, squeeze] = tf(async (x) => (result.push(x), true));

    for await (const x of iter) {
      const continue_ = await transduce(x);

      if (!continue_) {
        return result;
      }
    }

    await squeeze?.();
    return result;
  };
}
