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

const result = reduce((r, x: string) => `${r}\n${x}`, "")(tf)(s());
console.log(result);
foreach((x: string) => console.log(x))(tf)(s());
for (const x of iterate(tf)(s())) {
  console.log(x);
}
