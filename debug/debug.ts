import {
  combine,
  reduce,
  foreach,
  map,
  filter,
  take,
  partition,
} from "each-once";

const tf = combine(
  map((x: number) => x * 2),
  filter((x: number) => x % 4 === 0),
  take<number>(10),
  partition<number>(3)
);

const s = function* () {
  let x = 0;
  while (true) {
    yield x++;
  }
};

const result = reduce((r, x) => `${r},${x}`, "", tf)(s());
console.log(result);
foreach((x) => console.log(x), tf)(s());
