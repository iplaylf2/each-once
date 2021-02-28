import { AsyncTransduceFunction } from "../../transduce/async/type";

export function include<T, K>(v: K, tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<boolean> {
    let include = false;
    const [transduce, squeeze] = tf(
      async (x) => x !== v || ((include = true), false)
    );

    for await (const x of iter) {
      const continue_ = await transduce(x);

      if (!continue_) {
        return include;
      }
    }

    await squeeze?.();
    return include;
  };
}
