import { TransduceFunction, TransduceHandler } from "../type";

export function count<T>(
  tf?: TransduceFunction<T, any>
): TransduceHandler<T, number> {
  let count = 0;
  let transduce: any = () => (count++, true),
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

        return [true, count];
      }
    },
    done() {
      dispose?.(true);
      return count;
    },
  };
}
