import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";
import { OR } from "./tool";

interface Action<T> {
  (x: T): void | Promise<void>;
}

export function foreach<T, K>(
  f: Action<OR<K, T>>,
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, void> {
  let transduce: any = async (x: any) => (await f(x), true),
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

        return [true] as any;
      }
    },
    async done() {
      await dispose?.(true);
      return;
    },
  };
}
