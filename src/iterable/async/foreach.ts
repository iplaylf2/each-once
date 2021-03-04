import { AsyncTransduceFunction } from "../../transduce/async/type";

interface Action<T> {
  (x: T): any;
}

export function foreach<T, K>(f: Action<K>, tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<void> {
    const [transduce, dispose] = tf(f);

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
