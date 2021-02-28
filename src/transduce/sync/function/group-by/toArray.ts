import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";

export function toArray<T, K = T>(
  tf?: TransduceFunction<T, K>
): GroupByReduce<T, K[]> {
  let result: K[] = [];
  let transduce: any = (x: any) => (result.push(x), true),
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
        return [true, result];
      }
    },
    done() {
      isDone = true;
      squeeze?.();
      return result;
    },

    get isDone() {
      return isDone;
    },
  };
}
