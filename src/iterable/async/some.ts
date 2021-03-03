import { AsyncTransduceFunction } from "../../transduce/async/type";

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function some<T, K>(f: Predicate<K>, tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<boolean> {
    let some = false;
    const [transduce, dispose] = tf(async (x) =>
      (await f(x)) ? ((some = true), false) : true
    );

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await dispose?.(continue_);
    
    return some;
  };
}
