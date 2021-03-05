import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";
import { OR } from "./tool";

export function include<T, K>(
  v: OR<K, T>,
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, boolean> {
  let include = false;
  let transduce: any = (x: any) => x !== v || ((include = true), false),
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

        return [true, include];
      }
    },
    async done() {
      await dispose?.(true);
      return include;
    },
  };
}
