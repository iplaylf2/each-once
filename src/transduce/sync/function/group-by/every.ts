import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

interface Predicate<T> {
  (x: T): boolean;
}

export function every<T, K>(
  f: Predicate<OR<K, T>>,
  tf?: TransduceFunction<T, K>
): GroupByReduce<T, boolean> {
  let every = true;
  let transduce: any = (x: any) => f(x) || ((every = false), false),
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
        return [true, every];
      }
    },
    done() {
      isDone = true;
      squeeze?.();
      return every;
    },

    get isDone() {
      return isDone;
    },
  };
}
