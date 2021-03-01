import { combine, groupBy, take, foreach } from "each-once";
import * as Transduce from "each-once/transduce";

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
      (key) => Transduce.toArray(take<number>(10))
    )
  )
)(s());
