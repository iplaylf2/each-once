import { TransduceFunction } from "../../type";
import { GroupByReduce } from "../group-by";

export function count<T>(
  tf?: TransduceFunction<T, any>
): GroupByReduce<T, number> {
  return {
    reduce() {},
    done() {},

    get isDone() {
      return;
    },
  } as any;
}
