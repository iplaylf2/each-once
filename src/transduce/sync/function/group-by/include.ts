import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";
import { OR } from "./tool";

export function include<T, K>(
  v: OR<K, T>,
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
