import { AsyncTransduceFunction, AsyncTransduceHandler } from "../type";

export function toArray<T, K = T>(
  tf?: AsyncTransduceFunction<T, K>
): AsyncTransduceHandler<T, K[]> {
  let result: K[] = [];
  let transduce: any = (x: any) => (result.push(x), true),
    squeeze: any;
  [transduce, squeeze] = tf ? tf(transduce) : [transduce]!;

  let isDone = false;
  return {
    async reduce(x) {
      const continue_ = await transduce(x);
      if (continue_) {
        return [false];
      } else {
        isDone = true;
        return [true, result];
      }
    },
    async done() {
      isDone = true;
      await squeeze?.();
      return result;
    },

    get isDone() {
      return isDone;
    },
  };
}
