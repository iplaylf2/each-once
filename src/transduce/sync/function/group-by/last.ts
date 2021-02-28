import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";

export function last<T, K = T>(
  tf?: TransduceFunction<T, K>
): GroupByReduce<T, K> {
  let last: K;
  let transduce: any = (x: any) => ((last = x), true),
    squeeze: any;
  [transduce, squeeze] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        isDone = true;
        return [true, last];
      }
    },
    done() {
      isDone = true;
      squeeze?.();
      return last;
    },

    get isDone() {
      return isDone;
    },
  };
}
