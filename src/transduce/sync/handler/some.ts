import { TransduceFunction, TransduceHandler } from "../type";
import { OR } from "./tool";

interface Predicate<T> {
  (x: T): boolean;
}

export function some<T, K>(
  f: Predicate<OR<K, T>>,
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, boolean> {
  let some = false;
  let transduce: any = (x: any) => (f(x) ? ((some = true), false) : true),
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
        return [true, some];
      }
    },
    done() {
      isDone = true;
      squeeze?.();
      return some;
    },

    get isDone() {
      return isDone;
    },
  };
}
