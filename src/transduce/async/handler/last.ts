import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

export function last<T, K = T>(
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, K> {
  let last: K;
  let transduce: any = (x: any) => ((last = x), true),
    dispose: any;
  if (tf) {
    [transduce, dispose] = tf(transduce);
  }

  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        await dispose?.(false);

        return [true, last];
      }
    },
    async done() {
      await dispose?.(true);
      return last;
    },
  };
}
