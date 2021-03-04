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


  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        dispose?.(false);

        return [true, include];
      }
    },
    done() {

      dispose?.(true);
      return include;
    },
  };
}
