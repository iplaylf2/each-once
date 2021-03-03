import { TransduceFunction, TransduceHandler } from "../type";

export function first<T, K = T>(
  tf?: TransduceFunction<T, K>
): TransduceHandler<T, K | void> {
  let first: K;
  let transduce: any = (x: any) => ((first = x), false),
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
        return [true, first];
      }
    },
    done() {
      isDone = true;
      squeeze?.(true);
      return first;
    },

    get isDone() {
      return isDone;
    },
  };
}
