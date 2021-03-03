import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

export function last<T, K = T>(
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, K> {
  let last: K;
  let transduce: any = (x: any) => ((last = x), true),
    dispose: any;
  [transduce, dispose] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        await dispose?.(false);
        isDone = true;
        return [true, last];
      }
    },
    async done() {
      isDone = true;
      await dispose?.(true);
      return last;
    },

    get isDone() {
      return isDone;
    },
  };
}
