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
    dispose: any;
  if (tf) {
    [transduce, dispose] = tf(transduce);
  }

  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        dispose?.(false);

        return [true, some];
      }
    },
    done() {
      dispose?.(true);
      return some;
    },
  };
}
