import { AsyncTransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

export function include<T, K>(
  v: OR<K, T>,
  tf?: AsyncTransduceFunction<T, K>
): GroupByReduce<T, boolean> {
  let include = false;
  let transduce: any = (x: any) => x !== v || ((include = true), false),
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
        return [true, include];
      }
    },
    async done() {
      isDone = true;
      await squeeze?.();
      return include;
    },

    get isDone() {
      return isDone;
    },
  };
}
