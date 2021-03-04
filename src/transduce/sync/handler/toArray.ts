import { TransduceFunction, TransduceHandler } from "../type";

export function toArray<T, K = T>(
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, K[]> {
  let result: K[] = [];
  let transduce: any = (x: any) => (result.push(x), true),
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
        return [true, result];
      }
    },
    done() {
      isDone = true;
      dispose?.(true);
      return result;
    },
  };
}
