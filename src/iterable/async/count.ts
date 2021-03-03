import { AsyncTransduceFunction } from "../../transduce/async/type";

export function count<T>(tf: AsyncTransduceFunction<T, any>) {
  return async function (iter: AsyncIterable<T>): Promise<number> {
    let count = 0;
    const [transduce, squeeze] = tf(async () => (count++, true));

    let continue_ = true;
    for await (const x of iter) {
      if (!(await transduce(x))) {
        continue_ = false;
        break;
      }
    }

    await squeeze?.(continue_);
    
    return count;
  };
}
