import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

export function first<T, K = T>(
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, K | void> {
  let first: K;
  let transduce: any = (x: any) => ((first = x), false),
    squeeze: any;
  [transduce, squeeze] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        await squeeze?.(false);
        isDone = true;
        return [true, first];
      }
    },
    async done() {
      isDone = true;
      await squeeze?.(true);
      return first;
    },

    get isDone() {
      return isDone;
    },
  };
}
