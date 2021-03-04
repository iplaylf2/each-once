import { TransduceFunction, TransduceHandler } from "../type";

export function toArray<T, K = T>(
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, K[]> {
  let result: K[] = [];
  let transduce: any = (x: any) => (result.push(x), true),
    dispose: any;
  [transduce, dispose] = tf ? tf(transduce) : [transduce]!;

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
