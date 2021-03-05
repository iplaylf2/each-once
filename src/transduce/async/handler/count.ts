import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

export function count<T>(
  tf?: AsyncTransduceFunction<T, any>
): AsyncTransduceHandler<T, number> {
  let count = 0;
  let transduce: any = () => (count++, true),
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

        return [true, count];
      }
    },
    async done() {
      await dispose?.(true);
      return count;
    },
  };
}
