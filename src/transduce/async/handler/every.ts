import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";
import { OR } from "./tool";

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function every<T, K>(
  f: Predicate<OR<K, T>>,
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, boolean> {
  let every = true;
  let transduce: any = async (x: any) =>
      (await f(x)) || ((every = false), false),
    dispose: any;
  if (tf) {
    [transduce, dispose] = tf(transduce);
  }

  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        await dispose?.(false);

        return [true, every];
      }
    },
    async done() {
      await dispose?.(true);
      return every;
    },
  };
}
