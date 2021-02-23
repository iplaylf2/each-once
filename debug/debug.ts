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

const result = reduce(s(), tf, (r, x) => `${r}\n${x}`, "");
console.log(result);
foreach(s(), tf, (x) => console.log(x));
for (const x of iterate(s(), tf)) {
  console.log(x);
}
