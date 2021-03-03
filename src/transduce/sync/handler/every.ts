import { TransduceFunction, TransduceHandler } from "../type";
import { OR } from "./tool";

interface Predicate<T> {
  (x: T): boolean;
}

export function every<T, K>(
  f: Predicate<OR<K, T>>,
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, boolean> {
  let every = true;
  let transduce: any = (x: any) => f(x) || ((every = false), false),
    dispose: any;
  [transduce, dispose] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        dispose?.(false);
        isDone = true;
        return [true, every];
      }
    },
    done() {
      isDone = true;
      dispose?.(true);
      return every;
    },

    get isDone() {
      return isDone;
    },
  };
}
