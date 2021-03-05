import { TransduceFunction, TransduceHandler } from "../type";

export function toArray<T, K = T>(
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, K[]> {
  let result: K[] = [];
  let transduce: any = (x: any) => (result.push(x), true),
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

        return [true, result];
      }
    },
    done() {
      dispose?.(true);
      return result;
    },
  };
}
