import { AsyncTransduceFunction } from "../../transduce/async/type";

export function toArray<T, K>(tf: AsyncTransduceFunction<T, K>) {
  return async function (iter: AsyncIterable<T>): Promise<K[]> {
    let result: K[] = [];
    const [transduce, squeeze] = tf(async (x) => (result.push(x), true));

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await squeeze?.(continue_);
    
    return result;
  };
}
