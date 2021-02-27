import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

interface Predicate<T> {
  (x: T): boolean;
}

export function some<T, K>(
  f: Predicate<OR<K, T>>,
  tf?: TransduceFunction<T, K>
): GroupByReduce<T, boolean> {
  return {
    reduce() {},
    done() {},

    get isDone() {
      return;
    },
  } as any;
}
