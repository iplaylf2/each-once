import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";
import { OR } from "./tool";

export function include<T, K>(
  v: OR<K, T>,
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, boolean> {
  let include = false;
  let transduce: any = (x: any) => x !== v || ((include = true), false),
    dispose: any;
  [transduce, dispose] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        await dispose?.(false);
        isDone = true;
        return [true, include];
      }
    },
    async done() {
      isDone = true;
      await dispose?.(true);
      return include;
    },

    get isDone() {
      return isDone;
    },
  };
}
