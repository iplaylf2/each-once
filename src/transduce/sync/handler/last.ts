import { TransduceFunction, TransduceHandler } from "../type";

export function last<T, K = T>(
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, K> {
  let last: K;
  let transduce: any = (x: any) => ((last = x), true),
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

        return [true, last];
      }
    },
    done() {
      dispose?.(true);
      return last;
    },
  };
}
