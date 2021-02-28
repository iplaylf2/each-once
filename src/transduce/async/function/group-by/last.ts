import { AsyncTransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";

export function last<T, K = T>(
  tf?: AsyncTransduceFunction<T, K>
): GroupByReduce<T, K> {
  let last: K;
  let transduce: any = (x: any) => ((last = x), true),
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
        return [true, last];
      }
    },
    async done() {
      isDone = true;
      await squeeze?.();
      return last;
    },

    get isDone() {
      return isDone;
    },
  };
}
