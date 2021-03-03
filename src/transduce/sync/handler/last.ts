import { TransduceFunction, TransduceHandler } from "../type";

export function last<T, K = T>(
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, K> {
  let last: K;
  let transduce: any = (x: any) => ((last = x), true),
    squeeze: any;
  [transduce, squeeze] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    reduce(x) {
      const continue_ = transduce(x);
      if (continue_) {
        return [false];
      } else {
        squeeze?.(false);
        isDone = true;
        return [true, last];
      }
    },
    done() {
      isDone = true;
      squeeze?.(true);
      return last;
    },

    get isDone() {
      return isDone;
    },
  };
}
