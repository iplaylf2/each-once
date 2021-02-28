import { AsyncTransduceFunction } from "../../transduce/async/type";

export function count<T>(tf: AsyncTransduceFunction<T, any>) {
  return async function (iter: AsyncIterable<T>): Promise<number> {
    let count = 0;
    const [transduce, squeeze] = tf(async () => (count++, true));

    for await (const x of iter) {
      const continue_ = await transduce(x);

      if (!continue_) {
        return count;
      }
    }

    await squeeze?.();
    return count;
  };
}
