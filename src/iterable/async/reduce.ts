import { AsyncTransduceFunction } from "../../transduce/async/type";

interface ReduceFunction<T, K> {
  (r: K, x: T): K | Promise<K>;
}

export function reduce<T, K, R>(
  rf: ReduceFunction<K, R>,
  v: R,
  tf: AsyncTransduceFunction<T, K>
) {
  return async function (iter: AsyncIterable<T>): Promise<R> {
    let r = v;
    const [transduce, dispose] = tf(async (x) => ((r = await rf(r, x)), true));

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await dispose?.(continue_);
    
    return r;
  };
}
