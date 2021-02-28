import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

interface Action<T> {
  (x: T): any;
}

export function foreach<T, K>(
  f: Action<OR<K, T>>,
  tf?: TransduceFunction<T, K>
): GroupByReduce<T, void> {
  let transduce: any = (x: any) => f(x) !== false,
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
        return [true] as any;
      }
    },
    done() {
      isDone = true;
      squeeze?.();
      return;
    },

    get isDone() {
      return isDone;
    },
  };
}
