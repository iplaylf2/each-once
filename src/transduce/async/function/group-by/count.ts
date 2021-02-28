import { AsyncTransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";

export function count<T>(
  tf?: AsyncTransduceFunction<T, any>
): GroupByReduce<T, number> {
  let count = 0;
  let transduce: any = () => (count++, true),
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
        return [true, count];
      }
    },
    async done() {
      isDone = true;
      await squeeze?.();
      return count;
    },

    get isDone() {
      return isDone;
    },
  };
}
