import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

interface ReduceFunction<T, K> {
  (r: K, x: T): K;
}

export function reduce<T, K, R>(
  rf: ReduceFunction<OR<K, T>, R>,
  v: R,
  tf?: TransduceFunction<T, K>
): GroupByReduce<T, R> {
  return {
    reduce() {},
    done() {},

    get isDone() {
      return;
    },
  } as any;
}
