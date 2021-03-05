import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

export function first<T, K = T>(
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, K | void> {
  let first: K;
  let transduce: any = (x: any) => ((first = x), false),
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

        return [true, first];
      }
    },
    async done() {
      await dispose?.(true);
      return first;
    },
  };
}
