import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

interface Action<T> {
  (x: T): any;
}

export function foreach<T, K>(
  f: Action<OR<K, T>>,
  tf?: TransduceFunction<T, K>
): GroupByReduce<T, void> {
  return {
    reduce() {},
    done() {},

    get isDone() {
      return;
    },
  } as any;
}
