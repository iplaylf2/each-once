import { AsyncTransduceFunction } from "../../transduce/async/type";

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function every<T, K>(f: Predicate<K>, tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<boolean> {
    let every = true;
    const [transduce, squeeze] = tf(
      async (x) => (await f(x)) || ((every = false), false)
    );

    for await (const x of iter) {
      const continue_ = await transduce(x);

      if (!continue_) {
        return every;
      }
    }

    await squeeze?.();
    return every;
  };
}
