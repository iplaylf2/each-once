import {
  combine,
  reduce,
  foreach,
  iterate,
  map,
  filter,
  take,
} from "each-once";
import { TransduceFunction } from "each-once/transduce/type";

const tf: TransduceFunction<number, string> = combine(
  map((x: number) => x * 2),
  filter((x: number) => x % 4 === 0),
  take<number>(10),
  map((x: number) => `x : ${x}`)
) as any;

const s = function* () {
  let x = 0;
  while (true) {
    yield x++;
  }
};

const result = reduce(s(), tf, (r, x) => `${r}\n${x}`, "");
console.log(result);
foreach(s(), tf, (x) => console.log(x));
for (const x of iterate(s(), tf)) {
  console.log(x);
}
