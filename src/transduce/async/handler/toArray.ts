import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

export function toArray<T, K = T>(
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, K[]> {
  let result: K[] = [];
  let transduce: any = (x: any) => (result.push(x), true),
    dispose: any;
  [transduce, dispose] = tf ? tf(transduce) : [transduce]!;

  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        await dispose?.(false);

        return [true, result];
      }
    },
    async done() {
      await dispose?.(true);
      return result;
    },
  };
}
