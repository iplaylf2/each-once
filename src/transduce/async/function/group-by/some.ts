import { AsyncTransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function some<T, K>(
  f: Predicate<OR<K, T>>,
  tf?: AsyncTransduceFunction<T, K>
): GroupByReduce<T, boolean> {
  let some = false;
  let transduce: any = async (x: any) =>
      (await f(x)) ? ((some = true), false) : true,
    squeeze: any;
  [transduce, squeeze] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        isDone = true;
        return [true, some];
      }
    },
    async done() {
      isDone = true;
      await squeeze?.();
      return some;
    },

    get isDone() {
      return isDone;
    },
  };
}
