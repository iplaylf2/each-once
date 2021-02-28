import { AsyncTransduceFunction } from "../../transduce/async/type";

interface Action<T> {
  (x: T): any;
}

export function foreach<T, K>(f: Action<K>, tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<void> {
    const [transduce, squeeze] = tf(async (x) => (await f(x)) !== false);

    for await (const x of iter) {
      const continue_ = await transduce(x);

      if (!continue_) {
        return;
      }
    }

    await squeeze?.();
  };
}
