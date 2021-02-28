import { AsyncTransduceFunction } from "../../transduce/async/type";

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function some<T, K>(f: Predicate<K>, tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<boolean> {
    let some = false;
    const [transduce, squeeze] = tf(async (x) =>
      (await f(x)) ? ((some = true), false) : true
    );

    for await (const x of iter) {
      const continue_ = await transduce(x);

      if (!continue_) {
        return some;
      }
    }

    await squeeze?.();
    return some;
  };
}
