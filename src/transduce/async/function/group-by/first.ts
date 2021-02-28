import { AsyncTransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";

export function first<T, K = T>(
  tf?: AsyncTransduceFunction<T, K>
): GroupByReduce<T, K | void> {
  let first: K;
  let transduce: any = (x: any) => ((first = x), false),
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
        return [true, first];
      }
    },
    async done() {
      isDone = true;
      await squeeze?.();
      return first;
    },

    get isDone() {
      return isDone;
    },
  };
}
