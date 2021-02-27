import {
  combine,
  reduce,
  foreach,
  iterate,
  map,
  filter,
  take,
} from "each-once";

const tf = combine(
  map((x: number) => x * 2),
  filter((x: number) => x % 4 === 0),
  take<number>(10),
  map((x: number) => `x : ${x}`)
);

const s = function* () {
  let x = 0;
  while (true) {
    yield x++;
  }
};

const result = reduce(tf, (r, x: string) => `${r}\n${x}`, "")(s());
console.log(result);
foreach(tf, (x: string) => console.log(x))(s());
for (const x of iterate(tf)(s())) {
  console.log(x);
}
