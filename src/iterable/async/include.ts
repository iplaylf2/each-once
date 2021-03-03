import { AsyncTransduceFunction } from "../../transduce/async/type";

export function include<T, K>(v: K, tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<boolean> {
    let include = false;
    const [transduce, squeeze] = tf(
      async (x) => x !== v || ((include = true), false)
    );

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await squeeze?.(continue_);
    
    return include;
  };
}
