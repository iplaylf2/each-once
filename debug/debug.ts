import { combine, foreach, groupBy, take } from "each-once";

import * as groupByReduce from "each-once/group-by";

const s = function* () {
  while (true) {
    yield Math.random() * 10;
  }
};

foreach(
  (x: number[]) => console.log(x),
  combine(
    take<number>(100),
    groupBy(
      (x: number) => Math.floor(x),
      (k) => groupByReduce.toArray(take<number>(10))
    )
  )
)(s());
