import { AsyncTransduceFunction } from "../../transduce/async/type";

interface Action<T> {
  (x: T): void | Promise<void>;
}

export function foreach<T, K>(f: Action<K>, tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<void> {
    const [transduce, dispose] = tf(async (x) => (await f(x), true));

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await dispose?.(continue_);
  };
}
