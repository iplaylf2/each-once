import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";
import { OR } from "./tool";

interface Action<T> {
  (x: T): any;
}

export function foreach<T, K>(
  f: Action<OR<K, T>>,
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, void> {
  let transduce: any = async (x: any) => (await f(x)) !== false,
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
        return [true] as any;
      }
    },
    async done() {
      isDone = true;
      await dispose?.(true);
      return;
    },

    get isDone() {
      return isDone;
    },
  };
}
