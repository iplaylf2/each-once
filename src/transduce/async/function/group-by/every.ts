import { AsyncTransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function every<T, K>(
  f: Predicate<OR<K, T>>,
  tf?: AsyncTransduceFunction<T, K>
): GroupByReduce<T, boolean> {
  let every = true;
  let transduce: any = async (x: any) =>
      (await f(x)) || ((every = false), false),
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
        return [true, every];
      }
    },
    async done() {
      isDone = true;
      await squeeze?.();
      return every;
    },

    get isDone() {
      return isDone;
    },
  };
}
