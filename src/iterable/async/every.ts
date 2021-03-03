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

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await squeeze?.(continue_);
    
    return every;
  };
}
