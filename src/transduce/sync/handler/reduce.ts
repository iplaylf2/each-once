import { TransduceFunction, TransduceHandler } from "../type";
import { OR } from "./tool";

interface ReduceFunction<T, K> {
  (r: K, x: T): K;
}

export function reduce<T, K, R>(
  rf: ReduceFunction<OR<K, T>, R>,
  v: R,
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, R> {
  let r = v;
  let transduce: any = (x: any) => ((r = rf(r, x)), true),
    dispose: any;
  [transduce, dispose] = tf ? tf(transduce) : [transduce]!;

  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        dispose?.(false);

        return [true, r];
      }
    },
    done() {
      dispose?.(true);
      return r;
    },
  };
}
