import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";

export function toArray<T, K = T>(
  tf?: TransduceFunction<T, K>
): GroupByReduce<T, K[]> {
  return {
    reduce() {},
    done() {},

    get isDone() {
      return;
    },
  } as any;
}
