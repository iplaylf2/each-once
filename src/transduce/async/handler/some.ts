import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";
import { OR } from "./tool";

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function some<T, K>(
  f: Predicate<OR<K, T>>,
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, boolean> {
  let some = false;
  let transduce: any = async (x: any) =>
      (await f(x)) ? ((some = true), false) : true,
    dispose: any;
  [transduce, dispose] = tf ? tf(transduce) : [transduce]!;

  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        await dispose?.(false);

        return [true, some];
      }
    },
    async done() {
      await dispose?.(true);
      return some;
    },
  };
}
