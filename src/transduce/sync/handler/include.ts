import { TransduceFunction, TransduceHandler } from "../type";
import { OR } from "./tool";

export function include<T, K>(
  v: OR<K, T>,
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, boolean> {
  let include = false;
  let transduce: any = (x: any) => x !== v || ((include = true), false),
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
        return [true, include];
      }
    },
    done() {
      isDone = true;
      dispose?.(true);
      return include;
    },

    get isDone() {
      return isDone;
    },
  };
}
