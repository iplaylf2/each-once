import { TransduceFunction, TransduceHandler } from "../type";

export function first<T, K = T>(
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, K | void> {
  let first: K;
  let transduce: any = (x: any) => ((first = x), false),
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

        return [true, first];
      }
    },
    done() {
      dispose?.(true);
      return first;
    },
  };
}
